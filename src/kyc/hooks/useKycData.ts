// hooks/useKycData.ts - Custom hook for KYC data fetching and manipulation
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store.ts";
import { toast } from "sonner";
import {
  RequestToGetPendingKycRecords,
  RequestToUpdateKycStatus,
} from "../../services/keyManagement/requestService.ts";
import {
  KycBackendResponse,
  UserKYC,
  KycStatus,
  VerificationFormData,
} from "../types/types.ts";

export const useKycData = () => {
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const [users, setUsers] = useState<UserKYC[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserKYC | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<VerificationFormData>({
    accountId: "",
    docNumber: "",
    expirationDate: "",
  });

  const convertToUserKYC = useCallback(
    (userInfo: KycBackendResponse, index: number): UserKYC => {
      const getOrDefault = (value?: string, fallback = ""): string =>
        value ?? fallback;
      const normalizeStatus = (status?: string): KycStatus =>
        (status?.toUpperCase() ?? "PENDING") as KycStatus;

      // Ensure ID is never empty
      const id =
        userInfo.id ??
        userInfo.documentUniqueId ??
        `user-${index}-${Date.now()}`;

      return {
        id,
        accountId: getOrDefault(userInfo.accountId),
        docNumber: getOrDefault(userInfo.idNumber, userInfo.documentUniqueId),
        expirationDate: getOrDefault(userInfo.expirationDate),
        location: getOrDefault(userInfo.location),
        email: getOrDefault(userInfo.email),
        status: normalizeStatus(userInfo.status),
        frontID: getOrDefault(userInfo.frontID),
        backID: getOrDefault(userInfo.backID),
        selfie: getOrDefault(userInfo.selfie),
        taxDocument: getOrDefault(userInfo.taxDocument),
      };
    },
    [],
  );

  const fetchUsers = useCallback(async () => {
    if (!accountCert) return;

    try {
      setLoading(true);
      const response = await RequestToGetPendingKycRecords(accountCert);

      const parsedInfo = Array.isArray(response)
        ? (response as KycBackendResponse[])
        : (JSON.parse(response || "[]") as KycBackendResponse[]);

      setUsers(parsedInfo.map((info, index) => convertToUserKYC(info, index)));
    } catch (error) {
      toast.error("Failed to load pending KYC records");
      console.error("Error fetching KYC records:", error);
    } finally {
      setLoading(false);
    }
  }, [accountCert, convertToUserKYC]);

  useEffect(() => {
    if (accountCert) {
      fetchUsers();
    }
  }, [accountCert, fetchUsers]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const updateKycStatus = async (
    status: KycStatus,
    reason: string = status === "APPROVED"
      ? "Approved by teller"
      : "Rejected by teller",
  ): Promise<boolean> => {
    if (!selectedUser || !accountCert) {
      toast.error("Invalid verification request");
      return false;
    }

    try {
      const response = await RequestToUpdateKycStatus(
        selectedUser.accountId,
        formData.docNumber || selectedUser.docNumber,
        formData.expirationDate || selectedUser.expirationDate,
        status,
        accountCert,
        reason,
      );

      if (
        response &&
        typeof response === "string" &&
        response.startsWith("Failed")
      ) {
        toast.error(`${status} failed: User identity mismatch`);
        return false;
      }

      await fetchUsers();
      setSelectedUser(null);
      toast.success(`KYC ${status.toLowerCase()} successfully`);
      return true;
    } catch (error) {
      toast.error(`${status} failed: Server error`);
      console.error(`${status} error:`, error);
      return false;
    }
  };

  const resetForm = () => {
    setFormData({
      accountId: "",
      docNumber: "",
      expirationDate: "",
    });
  };

  const selectUser = (user: UserKYC) => {
    setSelectedUser(user);
    resetForm();
  };

  return {
    users,
    selectedUser,
    loading,
    formData,
    selectUser,
    clearSelectedUser: () => setSelectedUser(null),
    handleInputChange,
    updateKycStatus,
    fetchUsers,
  };
};
