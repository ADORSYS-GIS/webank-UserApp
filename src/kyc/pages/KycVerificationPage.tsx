/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast, ToastContainer } from "react-toastify";
import { FiArrowLeft } from "react-icons/fi";
import {
  RequestToGetKycRecordsBySearch,
  RequestToUpdateKycStatus,
} from "../../services/keyManagement/requestService";

interface UserKYC {
  id: string;
  accountId: string;
  docNumber: string;
  expirationDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

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
        id: userInfo.id || userInfo.documentUniqueId || "",
        accountId: userInfo.accountId || "",
        docNumber: userInfo.documentNumber || userInfo.idNumber || "",
        expirationDate: userInfo.expirationDate || "",
        status: (userInfo.status?.toLowerCase() || "pending") as
          | "PENDING"
          | "APPROVED"
          | "REJECTED",
      });

      setFormData({
        accountId: userInfo.accountId || "",
        docNumber: "",
        expirationDate: "",
      });
    } catch (error) {
      toast.error("Search failed. Please try again");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.accountId ||
      !formData.docNumber ||
      !formData.expirationDate
    ) {
      toast.error("Please complete all fields");
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
          formData.docNumber,
          formData.expirationDate,
          "APPROVED",
          accountCert,
        );
        if (backendResponse.startsWith("Failed")) {
          toast.error("Verification failed, user identity mismatch");
          return;
        }
        setUser((prev) => (prev ? { ...prev, ...formData } : null));
        toast.success("KYC updated successfully");
      } else {
        const newUser: UserKYC = {
          id: formData.docNumber,
          ...formData,
          status: "PENDING",
        };
        setUser(newUser);
        toast.success("Verification initiated");
      }
    } catch (error) {
      toast.error("Verification failed");
      console.error(error);
    }
  };

  const resetView = () => {
    setUser(null);
    setSearchTerm("");
    setFormData({ accountId: "", docNumber: "", expirationDate: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-600 to-cyan-500 mb-8 text-center drop-shadow-sm"
        >
          KYC Verification
        </h1>

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

            <form onSubmit={handleVerification} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account ID
                  </label>
                  <input
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Number
                  </label>
                  <input
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
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date
                  </label>
                  <input
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
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-10 py-4 bg-blue-600 text-white rounded-full 
                    hover:bg-blue-700 transition-all shadow-lg 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    focus:ring-offset-2 disabled:bg-gray-300"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
