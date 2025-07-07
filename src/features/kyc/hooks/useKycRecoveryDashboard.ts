import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  RequestToGetKycRecordsBySearch,
  RequestToValidateRecoveryDetails,
} from "@services/keyManagement/requestService";

// export interface UserKYC { // Removed as unused
  id: string;
  oldAccountId: string;
  docNumber?: string;
  expirationDate?: string;
  location: string;
  email: string;
  status: string;
  frontID?: string;
  backID?: string;
  selfie?: string;
  taxDocument?: string;
}

export function useKycRecoveryDashboard() {
  const accountCert = useSelector((state: RootState) => state.account.accountCert);
  const [foundRecord, setFoundRecord] = useState<UserKYC | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({ docNumber: "", expirationDate: "" });
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "APPROVED":
        return "bg-emerald-100 text-emerald-800 ring-emerald-300";
      case "PENDING":
        return "bg-amber-100 text-amber-800 ring-amber-300";
      default:
        return "bg-rose-100 text-rose-800 ring-rose-300";
    }
  };

  const isRecoveryAllowed = () => {
    return foundRecord && foundRecord.status.toUpperCase() === "APPROVED";
  };

  const getStatusMessage = () => {
    if (foundRecord) {
      if (foundRecord.status.toUpperCase() === "PENDING") {
        return "Recovery not available for pending records";
      } else if (foundRecord.status.toUpperCase() === "REJECTED") {
        return "Recovery not available for rejected records";
      }
    }
    return "Not Available";
  };

  // Step 1: search by document ID
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a document number");
      return;
    }
    if (!accountCert) {
      toast.error("Account authentication missing");
      return;
    }
    try {
      setLoading(true);
      setFoundRecord(null);
      const response = await RequestToGetKycRecordsBySearch(searchTerm, accountCert);
      const parsed = Array.isArray(response) ? response : JSON.parse(response ?? "[]");
      if (!parsed.length) {
        toast.info("No user found with the provided document number");
        return;
      }
      const info = parsed[0];
      setFoundRecord({
        id: info.id ?? info.documentUniqueId,
        oldAccountId: info.accountId,
        docNumber: info.idNumber ?? info.documentUniqueId,
        expirationDate: info.expirationDate,
        location: info.location ?? "N/A",
        email: info.email ?? "N/A",
        status: info.status ?? "PENDING",
        frontID: info.frontID ?? "",
        backID: info.backID ?? "",
        selfie: info.selfie ?? "",
        taxDocument: info.taxDocument ?? "",
      });
      setFormData({ docNumber: "", expirationDate: "" });
    } catch (err) {
      console.error(err);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: validate docNumber + expirationDate only
  const handleContinueRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.docNumber || !formData.expirationDate) {
      toast.error("Please complete all fields");
      return;
    }
    if (!accountCert || !foundRecord) {
      toast.error("Unexpected error, please start over");
      return;
    }
    try {
      setLoading(true);
      const result = await RequestToValidateRecoveryDetails(
        foundRecord.oldAccountId,
        formData.docNumber,
        formData.expirationDate,
        accountCert,
      );
      if (result.startsWith("Failed")) {
        toast.error("Validation failed, details do not match");
        return;
      }
      navigate("/recovery/recovery-scanner", {
        state: { oldAccountId: foundRecord.oldAccountId },
      });
    } catch (err) {
      console.error(err);
      toast.error("Validation request failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    accountCert,
    foundRecord,
    setFoundRecord,
    loading,
    setLoading,
    searchTerm,
    setSearchTerm,
    formData,
    setFormData,
    navigate,
    selectedImage,
    setSelectedImage,
    getStatusStyles,
    isRecoveryAllowed,
    getStatusMessage,
    handleSearch,
    handleContinueRecovery,
  };
}
