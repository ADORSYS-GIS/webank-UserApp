import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setDocumentStatus } from "@state/accountSlice";
import { RequestToStoreKycDocument } from "@services/keyManagement/requestService";

// export type DocumentType = "frontID" | "backID" | "selfieID" | "taxDoc"; // Removed as unused
// export type ActivePopup = DocumentType | null; // Removed as unused

export function useDocumentImages() {
  const [images, setImages] = useState<Record<DocumentType, string | null>>({
    frontID: null,
    backID: null,
    selfieID: null,
    taxDoc: null,
  });
  const [activePopup, setActivePopup] = useState<ActivePopup>(null);

  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmitDocuments = async () => {
    try {
      if (!accountCert || !accountId) {
        toast.error("Account information is missing.");
        navigate("/guidelines");
        return;
      }
      const response = await RequestToStoreKycDocument(
        images.frontID ?? "",
        images.backID ?? "",
        images.selfieID ?? "",
        images.taxDoc ?? "",
        accountCert,
        accountId,
      );

      if (response.includes("saved")) {
        dispatch(setDocumentStatus("PENDING"));
        toast.success("Documents submitted successfully");
        navigate("/kyc");
      }
    } catch (error) {
      console.error("Error submitting documents:", error);
    }
  };

  useEffect(() => {
    // Optionally add any effect logic from the original component
  }, []);

  return {
    images,
    setImages,
    activePopup,
    setActivePopup,
    handleSubmitDocuments,
    accountId,
    accountCert,
    navigate,
    dispatch,
  };
}
