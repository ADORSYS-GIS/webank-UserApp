/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast, ToastContainer } from "react-toastify";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiCreditCard,
  FiCalendar,
  FiMap,
  FiCheck,
  FiDownload,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import {
  RequestToGetKycRecords,
  RequestToUpdateKycStatus,
  RequestToGetKycDocuments,
} from "../../services/keyManagement/requestService";

interface DocumentSet {
  FrontID: string;
  BackID: string;
  Selfie: string;
  TaxDocument: string;
}

interface UserInfo {
  publicKeyHash: string;
  fullName: string;
  profession: string;
  idNumber: string;
  dob: string;
  region: string;
  expirationDate: string;
  location: string;
  email: string;
  status: string;
}

interface UserKYC {
  id: string;
  documents: DocumentSet;
  info: UserInfo;
  status: "PENDING" | "approved" | "rejected";
}

interface ImageModalProps {
  selectedImage: string | null;
  onClose: () => void;
}
interface UserCardProps {
  user: UserKYC;
  onSelectUser: (user: UserKYC) => void;
}

const ImageModal = ({ selectedImage, onClose }: ImageModalProps) => {
  if (!selectedImage) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] w-full">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Document Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
            aria-label="Close modal"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <div className="p-4 overflow-auto">
          <img
            src={selectedImage}
            alt="Enlarged document"
            className="max-w-full max-h-[75vh] object-contain mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

const getStatusClass = (status: string) => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
const UserCard = ({ user, onSelectUser }: UserCardProps) => (
  <button
    onClick={() => onSelectUser(user)}
    className="w-full text-left bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
    aria-label={`View ${user.info.fullName}'s KYC details`}
    type="button"
  >
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">{user.info.fullName}</h2>
        <p className="text-sm text-gray-500 mt-1">{user.info.profession}</p>
      </div>
      <span
        className={`px-3 py-1 rounded-full text-sm ${getStatusClass(user.status)}`}
      >
        {user.status}
      </span>
    </div>
  </button>
);

export default function KYCDashboard() {
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const [users, setUsers] = useState<UserKYC[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserKYC | null>(null);

  useEffect(() => {
    const fetchKYCData = async () => {
      try {
        setLoading(true);
        if (!accountCert) {
          toast.error("Account authentication missing");
          setLoading(false);
          return;
        }

        const [infoResponse] = await Promise.all([
          RequestToGetKycRecords(accountCert),
        ]);
        const parsedInfo = Array.isArray(infoResponse)
          ? infoResponse
          : JSON.parse(infoResponse || "[]");

        const validatedInfo = parsedInfo.map((item: any) => ({
          id: item.documentUniqueId || "",
          publicKeyHash: item.publicKeyHash || "",
          info: {
            fullName: item.name || "",
            profession: item.profession || "",
            idNumber: item.documentUniqueId || "",
            dob: item.dateOfBirth || "",
            region: item.region || "",
            expirationDate: item.expirationDate || "",
            location: item.location || "N/A",
            email: item.email || "N/A",
            status: item.status || "PENDING",
          },
          status: item.status?.toLowerCase() || "pending",
        }));

        const publicKeyHash = validatedInfo[0].publicKeyHash;
        const docsResponse = await RequestToGetKycDocuments(
          publicKeyHash,
          accountCert,
        );
        const parsedDocs =
          typeof docsResponse === "string"
            ? JSON.parse(docsResponse)
            : docsResponse;

        const validatedDocs = {
          id: parsedDocs.publicKeyHash || "",
          documents: {
            FrontID: parsedDocs.frontID || "",
            BackID: parsedDocs.backID || "",
            Selfie: parsedDocs.selfieID || "",
            TaxDocument: parsedDocs.taxID || "",
          },
          status: parsedDocs.status || "PENDING",
        };

        const mergedData = validatedInfo.map((infoItem: any) => ({
          id: infoItem.publicKeyHash,
          info: infoItem.info,
          documents:
            validatedDocs.id === infoItem.publicKeyHash
              ? validatedDocs.documents
              : {
                  FrontID: "",
                  BackID: "",
                  Selfie: "",
                  TaxDocument: "",
                },
          status:
            validatedDocs.id === infoItem.publicKeyHash
              ? validatedDocs.status
              : "PENDING",
        }));

        setUsers(mergedData);
      } catch (error) {
        toast.error("Failed to load KYC requests");
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKYCData();
  }, [accountCert]);

  const updateKYCStatus = async (
    userId: string,
    status: "approved" | "rejected",
  ) => {
    try {
      if (!accountCert) {
        toast.error("Authentication required");
        return;
      }

      const user = users.find((user) => user.id === userId);
      if (!user) {
        toast.error("User not found");
        return;
      }

      await RequestToUpdateKycStatus(user.id, status, accountCert);

      setUsers(
        users.map((user) => (user.id === userId ? { ...user, status } : user)),
      );
      toast.success(
        `KYC ${status === "approved" ? "approved" : "rejected"} successfully`,
      );
    } catch (error) {
      toast.error(`Failed to ${status} KYC`);
      console.error("Update error:", error);
    }
  };

  if (loading)
    return <div className="p-8 text-center">Loading verifications...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ImageModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
      <div className="max-w-7xl mx-auto">
        {!selectedUser ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
              Pending KYC Verifications
            </h1>
            <div className="grid grid-cols-1 gap-4">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onSelectUser={setSelectedUser}
                />
              ))}
            </div>
          </>
        ) : (
          <div>
            <button
              onClick={() => setSelectedUser(null)}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800"
              aria-label="Return to previous screen"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Pending Profiles</span>
            </button>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedUser.info.fullName}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedUser.info.profession}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getStatusClass(selectedUser.status)}`}
                >
                  {selectedUser.status}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📁 Documents
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DocumentCard
                      title="Front ID"
                      url={selectedUser.documents.FrontID}
                      type="image"
                      onImageClick={setSelectedImage}
                    />
                    <DocumentCard
                      title="Back ID"
                      url={selectedUser.documents.BackID}
                      type="image"
                      onImageClick={setSelectedImage}
                    />
                    <DocumentCard
                      title="Selfie"
                      url={selectedUser.documents.Selfie}
                      type="image"
                      onImageClick={setSelectedImage}
                    />
                    <DocumentCard
                      title="Tax Document"
                      url={selectedUser.documents.TaxDocument}
                      type="image"
                      onImageClick={setSelectedImage}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    👤 Personal Information
                  </h3>
                  <div className="space-y-4">
                    <InfoRow
                      icon={<FiUser />}
                      label="Full Name"
                      value={selectedUser.info.fullName}
                    />
                    <InfoRow
                      icon={<FiBriefcase />}
                      label="Profession"
                      value={selectedUser.info.profession}
                    />
                    <InfoRow
                      icon={<FiCreditCard />}
                      label="ID Number"
                      value={selectedUser.info.idNumber}
                    />
                    <InfoRow
                      icon={<FiCalendar />}
                      label="Date of Birth"
                      value={selectedUser.info.dob}
                    />
                    <InfoRow
                      icon={<FiMapPin />}
                      label="Region"
                      value={selectedUser.info.region}
                    />
                    <InfoRow
                      icon={<FiClock />}
                      label="Expiration Date"
                      value={selectedUser.info.expirationDate}
                    />
                    <InfoRow
                      icon={<FiMap />}
                      label="Location"
                      value={selectedUser.info.location}
                    />
                    <InfoRow
                      icon={<FiMail />}
                      label="Email"
                      value={selectedUser.info.email}
                    />
                    <InfoRow
                      icon={<FiCheck />}
                      label="Status"
                      value={selectedUser.info.status}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => updateKYCStatus(selectedUser.id, "rejected")}
                  className="px-6 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                  disabled={selectedUser.status !== "PENDING"}
                >
                  Reject
                </button>
                <button
                  onClick={() => updateKYCStatus(selectedUser.id, "approved")}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={selectedUser.status !== "PENDING"}
                >
                  Approve
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

const DocumentCard = ({
  title,
  url,
  type,
  onImageClick,
}: {
  title: string;
  url: string;
  type: "image" | "pdf";
  onImageClick?: (url: string) => void;
}) => {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${title}_${Date.now()}.${type === "image" ? "jpg" : "pdf"}`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClick = () => {
    if (url && onImageClick) {
      onImageClick(url);
    }
  };

  return (
    <button
      className="w-full bg-gray-50 rounded-lg p-4 h-50 flex flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={handleClick}
      aria-label={`View ${title} document`}
      type="button"
    >
      <div className="flex justify-between items-center mb-2 w-full">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <button
          onClick={handleDownload}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
          title="Download document"
          aria-label={`Download ${title}`}
          type="button"
        >
          <FiDownload className="w-4 h-4" />
        </button>
      </div>
      <div className="relative flex-1">
        {type === "image" ? (
          <img
            src={url}
            alt={title}
            className="w-full h-full object-contain rounded-md bg-white"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-md p-2">
            <span className="text-blue-600 mb-2">📄 PDF Document</span>
            <button
              onClick={handleDownload}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
              aria-label={`Download ${title} PDF`}
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </button>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-medium text-gray-900">{value || "N/A"}</span>
  </div>
);
