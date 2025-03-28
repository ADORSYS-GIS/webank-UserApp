/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiCreditCard,
  FiCalendar,
  FiMap,
  FiDownload,
  FiX,
  FiArrowLeft,
} from "react-icons/fi";
import { RequestToGetKycRecordsBySearch } from "../../services/keyManagement/requestService";

interface DocumentSet {
  FrontID: string;
  BackID: string;
  Selfie: string;
  TaxDocument: string;
}

interface UserInfo {
  fullName: string;
  profession: string;
  idNumber: string;
  dob: string;
  region: string;
  expirationDate: string;
  location: string;
  email: string;
}

interface UserKYC {
  id: string;
  oldAccountId?: string; // Sensitive data not displayed in UI
  documents: DocumentSet;
  info: UserInfo;
}

interface ImageModalProps {
  selectedImage: string | null;
  onClose: () => void;
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
      className="w-full bg-gray-50 rounded-lg p-4 flex flex-col cursor-pointer text-left hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      onClick={handleClick}
      aria-label={`View ${title} document`}
      type="button"
    >
      <div className="flex justify-between items-center mb-2 w-full">
        <p className="text-sm font-medium text-gray-700">{title}</p>
        <a
          href={url}
          onClick={handleDownload}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-200"
          title="Download document"
          aria-label={`Download ${title}`}
          download
        >
          <FiDownload className="w-4 h-4" />
        </a>
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
            <span className="text-blue-600 mb-2">PDF Document</span>
            <a
              href={url}
              download
              className="text-sm text-blue-600 hover:text-blue-800 underline"
              aria-label={`Download ${title} PDF`}
            >
              Download PDF
            </a>
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

export default function RecoveryDashboard() {
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const [user, setUser] = useState<UserKYC | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (!accountCert) {
        toast.error("Account authentication missing");
        return;
      }

      // Fetch user data based on the document number
      const response = await RequestToGetKycRecordsBySearch(
        searchTerm,
        accountCert,
      );
      console.log("test", response);
      const parsedInfo = Array.isArray(response)
        ? response
        : JSON.parse(response || "[]");

      if (parsedInfo.length === 0) {
        toast.error("No user found with the provided document number");
        return;
      }

      const userInfo = parsedInfo[0];

      // Extract documents and oldAccountId from the response
      const { frontID, backID, selfie, taxDocument, accountId } = userInfo;

      console.log("oldaccid", accountId);
      setUser({
        id: userInfo.id,
        oldAccountId: accountId || undefined,
        documents: {
          FrontID: frontID || "",
          BackID: backID || "",
          Selfie: selfie || "",
          TaxDocument: taxDocument || "",
        },
        info: {
          fullName: userInfo.fullName || "",
          profession: userInfo.profession || "",
          idNumber: userInfo.idNumber || "",
          dob: userInfo.dob || "",
          region: userInfo.region || "",
          expirationDate: userInfo.expirationDate || "",
          location: userInfo.location || "N/A",
          email: userInfo.email || "N/A",
        },
      });
    } catch (error) {
      toast.error("Failed to load user data");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueRecovery = () => {
    const oldAccountId = user?.oldAccountId;
    navigate("/next-page", {
      state: { oldAccountId },
    });
  };

  if (loading)
    return <div className="p-8 text-center">Loading user data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
          Recovery Process
        </h1>
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
            <input
              type="text"
              placeholder="Enter Document Number (ID, Passport, etc.)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Search
            </button>
          </div>
        </div>
        {user ? (
          <div>
            <button
              onClick={() => setUser(null)}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Search</span>
            </button>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {user.info.fullName}
                  </h2>
                  <p className="text-sm sm:text-base text-gray-500">
                    {user.info.profession}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DocumentCard
                      title="Front ID"
                      url={user.documents.FrontID}
                      type="image"
                      onImageClick={setSelectedImage}
                    />
                    <DocumentCard
                      title="Back ID"
                      url={user.documents.BackID}
                      type="image"
                      onImageClick={setSelectedImage}
                    />
                    <DocumentCard
                      title="Selfie"
                      url={user.documents.Selfie}
                      type="image"
                      onImageClick={setSelectedImage}
                    />
                    <DocumentCard
                      title="Tax Document"
                      url={user.documents.TaxDocument}
                      type="image"
                      onImageClick={setSelectedImage}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                    Personal Information
                  </h3>
                  <div className="space-y-4">
                    <InfoRow
                      icon={<FiUser />}
                      label="Full Name"
                      value={user.info.fullName}
                    />
                    <InfoRow
                      icon={<FiBriefcase />}
                      label="Profession"
                      value={user.info.profession}
                    />
                    <InfoRow
                      icon={<FiCreditCard />}
                      label="ID Number"
                      value={user.info.idNumber}
                    />
                    <InfoRow
                      icon={<FiCalendar />}
                      label="Date of Birth"
                      value={user.info.dob}
                    />
                    <InfoRow
                      icon={<FiMapPin />}
                      label="Region"
                      value={user.info.region}
                    />
                    <InfoRow
                      icon={<FiClock />}
                      label="Expiration Date"
                      value={user.info.expirationDate}
                    />
                    <InfoRow
                      icon={<FiMap />}
                      label="Location"
                      value={user.info.location}
                    />
                    <InfoRow
                      icon={<FiMail />}
                      label="Email"
                      value={user.info.email}
                    />
                  </div>
                </div>
              </div>
              {/* Continue Recovery Process Button */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleContinueRecovery}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue Recovery Process
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Please search for a user to begin the recovery process.
          </p>
        )}
      </div>
      <ImageModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
