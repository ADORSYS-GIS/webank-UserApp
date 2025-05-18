import { useState } from "react";
import { useNavigate } from "react-router";
import { FiArrowLeft } from "react-icons/fi";
import { ImageModal } from "../components/ImageModal";
import { RejectionModal } from "../components/RejectionModal";
import { PendingKycList } from "../components/PendingKycList";
import { UserDetailsForm } from "../components/UserDetailsForm";
import { useKycData } from "../hooks/useKycData";
import { KycStatus } from "../types/types";

const KYCDashboard = () => {
  const {
    users,
    selectedUser,
    loading,
    formData,
    selectUser,
    clearSelectedUser,
    handleInputChange,
    updateKycStatus,
  } = useKycData();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const navigate = useNavigate();

  const handleVerification = async (
    e: React.FormEvent,
    status: KycStatus,
  ): Promise<void> => {
    e.preventDefault();
    await updateKycStatus(status);
  };

  const handleRejectWithReason = async (reason: string) => {
    const success = await updateKycStatus("REJECTED", reason);
    if (success) {
      setShowRejectionModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      <button
        onClick={() => navigate("/")}
        className="p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Back to dashboard"
        type="button"
      >
        <FiArrowLeft className="w-6 h-6 text-gray-600" />
      </button>

      <div className="max-w-3xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-600 to-cyan-500 mb-8 text-center drop-shadow-sm"
        >
          KYC Verification
        </h1>

        {!selectedUser ? (
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">
              Pending Verifications
            </h2>
            <PendingKycList
              users={users}
              loading={loading}
              onSelectUser={selectUser}
            />
          </div>
        ) : (
          <UserDetailsForm
            user={selectedUser}
            formData={formData}
            onInputChange={handleInputChange}
            onGoBack={clearSelectedUser}
            onApprove={(e) => handleVerification(e, "APPROVED")}
            onReject={() => setShowRejectionModal(true)}
            onImageClick={setSelectedImage}
          />
        )}

        <ImageModal
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
        />

        {showRejectionModal && (
          <RejectionModal
            onClose={() => setShowRejectionModal(false)}
            onReject={handleRejectWithReason}
          />
        )}
      </div>
    </div>
  );
}

export { KYCDashboard as Component };
