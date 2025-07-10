// hooks/useKycData.ts - Custom hook for KYC data fetching and manipulation
import { useState, useEffect, useCallback } from "react";
import { useAccountStore } from "@state/accountStore";
import { toast } from "sonner";
import {
  useKycManagementServiceGetApiPrsKycPending,
  useKycStatusUpdateServicePostApiPrsKycStatusUpdate,
} from "@openapi/generated/prs/queries/queries";
import {
  KycBackendResponse,
  UserKYC,
  KycStatus,
  VerificationFormData,
} from "@features/kyc/types/types";

export const useKycData = () => {
  const { accountCert } = useAccountStore();
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

  // OpenAPI query for pending KYC records
  const {
    data: pendingKycData,
    isLoading: kycLoading,
    refetch: refetchPendingKyc,
  } = useKycManagementServiceGetApiPrsKycPending();

  useEffect(() => {
    if (pendingKycData) {
      const parsedInfo: KycBackendResponse[] = Array.isArray(pendingKycData)
        ? pendingKycData
        : [pendingKycData];

      setUsers(parsedInfo.map((info, index) => convertToUserKYC(info, index)));
    }
    setLoading(kycLoading);
  }, [pendingKycData, kycLoading, convertToUserKYC]);

  const fetchUsers = useCallback(async () => {
    await refetchPendingKyc();
  }, [refetchPendingKyc]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // OpenAPI mutation for KYC status update
  const kycStatusMutation =
    useKycStatusUpdateServicePostApiPrsKycStatusUpdate();

  const updateKycStatus = async (
    status: KycStatus,
    rejectionReason: string = status === "APPROVED"
      ? "Approved by teller"
      : "Rejected by teller",
  ): Promise<boolean> => {
    if (!selectedUser || !accountCert) {
      toast.error("Invalid verification request");
      return false;
    }

    try {
      const response = await kycStatusMutation.mutateAsync({
        requestBody: {
          accountId: selectedUser.accountId,
          idNumber: formData.docNumber || selectedUser.docNumber,
          expiryDate: formData.expirationDate || selectedUser.expirationDate,
          status,
          rejectionReason,
        },
      });

      console.log("Backend response:", response);

      // Check if the operation was successful
      if (!response.success) {
        toast.error(
          `Failed to ${status.toLowerCase()} KYC: ${response.message}`,
        );
        return false;
      }
      // If we get here, the operation was successful
      toast.success(
        response.message || `KYC ${status.toLowerCase()} successfully`,
      );
      await fetchUsers();
      setSelectedUser(null);
      resetForm();
      return true;
    } catch (error) {
      console.error("Error updating KYC status:", error);
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
