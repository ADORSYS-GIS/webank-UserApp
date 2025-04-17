import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast, ToastContainer } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";
import {
  RequestToGetKycRecordsBySearch,
  RequestToUpdateKycStatus,
} from "../../services/keyManagement/requestService";
import { useNavigate } from "react-router-dom";
import { ImageModal } from "../components/ImageModal";
import { DocumentCard } from "../components/DocumentCard";

// Updated UserKYC interface to include all fields from UserInfoResponse
interface UserKYC {
  id: string;
  accountId: string;
  docNumber: string;
  expirationDate: string;
  location: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  frontID: string;
  backID: string;
  selfie: string;
  taxDocument: string;
}

// Helper function to determine the status class
const getStatusClass = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 ring-amber-300";
    case "APPROVED":
      return "bg-emerald-100 text-emerald-800 ring-emerald-300";
    case "REJECTED":
      return "bg-rose-100 text-rose-800 ring-rose-300";
    default:
      return "bg-gray-100 text-gray-800 ring-gray-300";
  }
};

export default function KYCDashboard() {
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const [user, setUser] = useState<UserKYC | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    accountId: "",
    docNumber: "",
    expirationDate: "",
  });
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const isVerificationAllowed = () => {
    return !user || user.status.toUpperCase() === "PENDING";
  };

  const getStatusMessage = () => {
    if (user) {
      if (user.status.toUpperCase() === "APPROVED") {
        return "Already Approved";
      } else if (user.status.toUpperCase() === "REJECTED") {
        return "Cannot Modify Rejected KYC";
      }
    }
    return "Not Available";
  };

  // Handle search functionality
  const handleSearch = async () => {
    try {
      setLoading(true);
      setUser(null);
      if (!accountCert) {
        toast.error("Authentication required");
        return;
      }
      if (!searchTerm.trim()) {
        toast.error("Please enter a document number");
        return;
      }
      const response = await RequestToGetKycRecordsBySearch(
        searchTerm,
        accountCert,
      );
      console.log("Backend Response:", response);
      const parsedInfo = Array.isArray(response)
        ? response
        : JSON.parse(response || "[]");

      if (parsedInfo.length === 0) {
        toast.info("No records found. Starting new verification");
        setFormData({ ...formData, docNumber: searchTerm });
        return;
      }
      const userInfo = parsedInfo[0];
      setUser({
        id: userInfo.id ?? userInfo.documentUniqueId ?? "",
        accountId: userInfo.accountId ?? "",
        docNumber: userInfo.idNumber ?? userInfo.documentUniqueId ?? "",
        expirationDate: userInfo.expirationDate ?? "",
        location: userInfo.location ?? "",
        email: userInfo.email ?? "",
        status: (userInfo.status?.toLowerCase() ?? "pending") as
          | "PENDING"
          | "APPROVED"
          | "REJECTED",
        frontID: userInfo.frontID ?? "",
        backID: userInfo.backID ?? "",
        selfie: userInfo.selfie ?? "",
        taxDocument: userInfo.taxDocument ?? "",
      });

      // If status is pending, keep docNumber and expirationDate blank
      // If status is approved or rejected, populate with existing values
      if (userInfo.status?.toLowerCase() === "pending") {
        setFormData({
          accountId: userInfo.accountId ?? "",
          docNumber: "",
          expirationDate: "",
        });
      } else {
        setFormData({
          accountId: userInfo.accountId ?? "",
          docNumber: userInfo.idNumber ?? userInfo.documentUniqueId ?? "",
          expirationDate: userInfo.expirationDate ?? "",
        });
      }
    } catch (error) {
      toast.error("Search failed. Please try again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle verification/update functionality
  const handleVerification = async (
    e: React.FormEvent,
    status: "APPROVED" | "REJECTED",
  ) => {
    e.preventDefault();

    // Only validate required fields for APPROVAL, not for REJECTION
    if (
      status === "APPROVED" &&
      (!formData.accountId || !formData.docNumber || !formData.expirationDate)
    ) {
      toast.error("Please complete all fields for approval");
      return;
    }

    try {
      if (!accountCert) {
        toast.error("Authentication required");
        return;
      }
      if (user) {
        const backendResponse = await RequestToUpdateKycStatus(
          user.accountId,
          formData.docNumber || user.docNumber, // Use existing docNumber if not provided
          formData.expirationDate || user.expirationDate, // Use existing expirationDate if not provided
          status,
          accountCert,
        );
        if (backendResponse.startsWith("Failed")) {
          toast.error(
            `${status === "APPROVED" ? "Verification" : "Rejection"} failed, user identity mismatch`,
          );
          return;
        }
        setUser((prev) =>
          prev
            ? {
                ...prev,
                docNumber:
                  status === "APPROVED" ? formData.docNumber : prev.docNumber,
                expirationDate:
                  status === "APPROVED"
                    ? formData.expirationDate
                    : prev.expirationDate,
                status: status,
              }
            : null,
        );
        toast.success(
          `KYC ${status === "APPROVED" ? "approved" : "rejected"} successfully`,
        );
        resetView();
      } else {
        const newUser: UserKYC = {
          id: formData.docNumber,
          ...formData,
          location: "",
          email: "",
          status: "PENDING",
          frontID: "",
          backID: "",
          selfie: "",
          taxDocument: "",
        };
        setUser(newUser);
        toast.success("Verification initiated");
        resetView();
      }
    } catch (error) {
      toast.error(
        `${status === "APPROVED" ? "Verification" : "Rejection"} failed`,
      );
      console.error(error);
    }
  };

  // Reset the form and view
  const resetView = () => {
    setUser(null);
    setSearchTerm("");
    setFormData({
      accountId: "",
      docNumber: "",
      expirationDate: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Close form"
      >
        <FiArrowLeft className="w-6 h-6 text-gray-600" />
      </button>
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-600 to-cyan-500 mb-8 text-center drop-shadow-sm"
        >
          KYC Verification
        </h1>

        {/* Search Section */}
        {!user && (
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4">
              <input
                type="text"
                placeholder="Enter Document Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-full 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 
                  placeholder-gray-400 text-lg transition"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full md:w-auto px-8 py-4 bg-blue-600 
                  text-white rounded-full hover:bg-blue-700 
                  transition-all mt-4 md:mt-0 shadow-md 
                  disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
            <p className="text-center text-gray-600 mt-4">
              Enter a document number to verify or start new verification
            </p>
          </div>
        )}

        {/* User Details and Form Section */}
        {user && (
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  KYC Details
                </h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium 
      ${getStatusClass(user.status)} transition-all`}
                >
                  {user.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={resetView}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Close form"
              >
                <FiArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Display User Information */}
            <form
              onSubmit={(e) => handleVerification(e, "APPROVED")}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full md:col-span-1">
                  <label
                    htmlFor="accountId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Account ID
                  </label>
                  <input
                    id="accountId"
                    value={formData.accountId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        accountId: e.target.value,
                      }))
                    }
                    placeholder="Enter account ID"
                    className="w-full px-6 py-4 border-2 border-gray-200 
                      rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 
                      placeholder-gray-400 disabled:bg-gray-100 transition"
                    disabled
                  />
                </div>
                <div>
                  <label
                    htmlFor="docNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Document Number
                  </label>
                  <input
                    id="docNumber"
                    value={formData.docNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        docNumber: e.target.value,
                      }))
                    }
                    placeholder="Enter document number"
                    className="w-full px-6 py-4 border-2 border-gray-200 
                      rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 
                      placeholder-gray-400 transition"
                    required
                    disabled={!isVerificationAllowed()}
                  />
                </div>
                <div>
                  <label
                    htmlFor="expirationDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Expiration Date
                  </label>
                  <input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        expirationDate: e.target.value,
                      }))
                    }
                    className="w-full px-6 py-4 border-2 border-gray-200 
                      rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 
                      placeholder-gray-400 transition"
                    required
                    disabled={!isVerificationAllowed()}
                  />
                </div>
              </div>

              {/* Display Email and Location */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">
                  Additional Information
                </h3>
                <div>
                  <div className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </div>
                  <p className="text-gray-800">
                    {user.email || "Not provided"}
                  </p>
                </div>
                <div>
                  <div className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </div>
                  <p className="text-gray-800">
                    {user.location || "Not provided"}
                  </p>
                </div>
              </div>

              {/* Display Documents */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-800">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DocumentCard
                    title="Front ID"
                    url={user.frontID}
                    type="image"
                    onImageClick={setSelectedImage}
                  />
                  <DocumentCard
                    title="Back ID"
                    url={user.backID}
                    type="image"
                    onImageClick={setSelectedImage}
                  />
                  <DocumentCard
                    title="Selfie"
                    url={user.selfie}
                    type="image"
                    onImageClick={setSelectedImage}
                  />
                  <DocumentCard
                    title="Tax Document"
                    url={user.taxDocument}
                    type="image"
                    onImageClick={setSelectedImage}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                {isVerificationAllowed() ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleVerification(e, "REJECTED")}
                      className="px-10 py-4 bg-rose-600 text-white rounded-full 
                        hover:bg-rose-700 transition-all shadow-lg 
                        focus:outline-none focus:ring-2 focus:ring-rose-500 
                        focus:ring-offset-2"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleVerification(e, "APPROVED")}
                      className="px-10 py-4 bg-blue-600 text-white rounded-full 
                        hover:bg-blue-700 transition-all shadow-lg 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:ring-offset-2"
                    >
                      Approve
                    </button>
                  </>
                ) : (
                  <div
                    className="px-10 py-4 bg-gray-300 text-white rounded-full 
                    shadow-lg cursor-not-allowed"
                  >
                    {getStatusMessage()}
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
      <ImageModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
