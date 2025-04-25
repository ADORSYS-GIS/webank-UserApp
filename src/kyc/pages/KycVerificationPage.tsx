import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast } from "sonner";
import { FiArrowLeft } from "react-icons/fi";
import {
  RequestToGetPendingKycRecords,
  RequestToUpdateKycStatus,
} from "../../services/keyManagement/requestService";
import { useNavigate } from "react-router-dom";
import { ImageModal } from "../components/ImageModal";
import { DocumentCard } from "../components/DocumentCard";

type KycStatus = "PENDING" | "APPROVED" | "REJECTED";

interface UserKYC {
  id: string;
  accountId: string;
  docNumber: string;
  expirationDate: string;
  location: string;
  email: string;
  status: KycStatus;
  frontID: string;
  backID: string;
  selfie: string;
  taxDocument: string;
}

interface KycBackendResponse {
  id?: string;
  documentUniqueId?: string;
  accountId?: string;
  idNumber?: string;
  expirationDate?: string;
  location?: string;
  email?: string;
  status?: string;
  frontID?: string;
  backID?: string;
  selfie?: string;
  taxDocument?: string;
}

const getStatusClass = (status: string): string => {
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

export default function KYCDashboard(): JSX.Element {
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const [user, setUser] = useState<UserKYC | null>(null);
  const [pendingUsers, setPendingUsers] = useState<UserKYC[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    accountId: "",
    docNumber: "",
    expirationDate: "",
  });
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Modified to ensure non-empty IDs
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

  const fetchPendingUsers = useCallback(async () => {
    if (!accountCert) return;

    try {
      setLoading(true);
      const response = await RequestToGetPendingKycRecords(accountCert);
      const parsedInfo = Array.isArray(response)
        ? (response as KycBackendResponse[])
        : (JSON.parse(response || "[]") as KycBackendResponse[]);

      // Added index parameter for unique key generation
      setPendingUsers(
        parsedInfo.map((info, index) => convertToUserKYC(info, index)),
      );
    } catch (error) {
      toast.error("Failed to load pending KYC records");
      console.error("Error fetching KYC records:", error);
    } finally {
      setLoading(false);
    }
  }, [accountCert, convertToUserKYC]);

  useEffect(() => {
    if (accountCert) {
      fetchPendingUsers();
    }
  }, [accountCert, fetchPendingUsers]);

  const handleVerification = async (
    e: React.FormEvent,
    status: KycStatus,
  ): Promise<void> => {
    e.preventDefault();

    if (!user || !accountCert) {
      toast.error("Invalid verification request");
      return;
    }

    try {
      const response = await RequestToUpdateKycStatus(
        user.accountId,
        formData.docNumber || user.docNumber,
        formData.expirationDate || user.expirationDate,
        status,
        accountCert,
      );

      if (
        response &&
        typeof response === "string" &&
        response.startsWith("Failed")
      ) {
        toast.error(`${status} failed: User identity mismatch`);
        return;
      }

      await fetchPendingUsers();
      setUser(null);
      toast.success(`KYC ${status.toLowerCase()} successfully`);
    } catch (error) {
      toast.error(`${status} failed: Server error`);
      console.error("Verification error:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const renderPendingList = (): JSX.Element => {
    if (loading) {
      return (
        <div className="text-center text-gray-500">
          Loading pending requests...
        </div>
      );
    }

    if (pendingUsers.length === 0) {
      return (
        <div className="text-center text-gray-500">
          No pending verifications
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pendingUsers.map((user) => (
          <div
            key={
              user.id ||
              `user-${user.accountId}-${Math.random().toString(36).substring(2, 9)}`
            }
            className="flex justify-between items-center p-4
              border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div>
              <p className="text-sm text-gray-600">
                AccountId: {user.accountId}
              </p>
            </div>
            <button
              onClick={() => setUser(user)}
              className="px-4 py-2 bg-blue-600 text-white rounded-full
                hover:bg-blue-700 transition-colors"
              type="button"
            >
              Review
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      <button
        onClick={() => navigate("/dashboard")}
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

        {!user ? (
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 mb-8">
            <h2 className="text-xl font-semibold mb-6">
              Pending Verifications
            </h2>
            {renderPendingList()}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  KYC Details
                </h2>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium 
                  ${getStatusClass(user.status)}`}
                >
                  {user.status}
                </span>
              </div>
              <button
                onClick={() => setUser(null)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                type="button"
                aria-label="Back to list"
              >
                <FiArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <p className="text-gray-700">
              We found the following info for this customer. To proceed, please
              re‑enter their Document Number and Expiration Date for
              verification.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <p className="text-sm text-gray-600">Location</p>
                <p className="mt-1 font-medium text-gray-900">
                  {user.location}
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50">
                <p className="text-sm text-gray-600">Email</p>
                <p className="mt-1 font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <form
              onSubmit={(e) => handleVerification(e, "APPROVED")}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="docNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Document Number
                  </label>
                  <input
                    id="docNumber"
                    type="text"
                    value={formData.docNumber}
                    onChange={handleInputChange}
                    placeholder="Enter document number"
                    className="w-full px-6 py-4 border-2 border-gray-200
                      rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      placeholder-gray-400 transition"
                    required
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
                    onChange={handleInputChange}
                    className="w-full px-6 py-4 border-2 border-gray-200
                      rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      placeholder-gray-400 transition"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Add unique keys to documents grid elements */}
                <DocumentCard
                  key="front-id"
                  title="Front ID"
                  url={user.frontID}
                  type="image"
                  onImageClick={setSelectedImage}
                />
                <DocumentCard
                  key="back-id"
                  title="Back ID"
                  url={user.backID}
                  type="image"
                  onImageClick={setSelectedImage}
                />
                <DocumentCard
                  key="selfie"
                  title="Selfie"
                  url={user.selfie}
                  type="image"
                  onImageClick={setSelectedImage}
                />
                <DocumentCard
                  key="tax-doc"
                  title="Tax Document"
                  url={user.taxDocument}
                  type="image"
                  onImageClick={setSelectedImage}
                />
              </div>

              <div className="flex justify-end space-x-4">
                {user.status === "PENDING" ? (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleVerification(e, "REJECTED")}
                      className="px-10 py-4 bg-rose-600 text-white rounded-full 
                        hover:bg-rose-700 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      type="submit"
                      className="px-10 py-4 bg-blue-600 text-white rounded-full 
                        hover:bg-blue-700 transition-colors"
                    >
                      Approve
                    </button>
                  </>
                ) : (
                  <div className="px-10 py-4 bg-gray-300 text-white rounded-full"></div>
                )}
              </div>
            </form>
          </div>
        )}

        <ImageModal
          selectedImage={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      </div>
    </div>
  );
}
