/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import {
  RequestToGetKycRecordsBySearch,
  RequestToValidateRecoveryDetails,
} from "../../services/keyManagement/requestService";

export default function RecoveryDashboard() {
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const [foundRecord, setFoundRecord] = useState<{
    id: string;
    oldAccountId: string;
    location: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    docNumber: "",
    expirationDate: "",
  });
  const navigate = useNavigate();

  /** Step1: search by document ID */
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
      const response = await RequestToGetKycRecordsBySearch(
        searchTerm,
        accountCert,
      );
      const parsed = Array.isArray(response)
        ? response
        : JSON.parse(response || "[]");
      if (!parsed.length) {
        toast.error("No user found with the provided document number");
        return;
      }
      const info = parsed[0];
      setFoundRecord({
        id: info.id,
        oldAccountId: info.accountId,
        location: info.location || "N/A",
        email: info.email || "N/A",
      });
      setFormData({ docNumber: "", expirationDate: "" });
    } catch (err) {
      console.error(err);
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  /** Step2: validate docNumber + expirationDate only */
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
      navigate("/recovery/getnewid", {
        state: { oldAccountId: foundRecord.oldAccountId },
      });
    } catch (err) {
      console.error(err);
      toast.error("Validation request failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        {foundRecord ? "Validating details…" : "Searching…"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <ToastContainer />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          Recovery Process
        </h1>

        {/* Step1: Search Form */}
        {!foundRecord && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
              <input
                type="text"
                placeholder="Enter Document Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        )}

        {/* Step2: Validation Form + Display of location & email */}
        {foundRecord && (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 space-y-6">
            <button
              onClick={() => setFoundRecord(null)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <FiArrowLeft className="w-5 h-5" />
              Back to Search
            </button>

            {/* Instruction */}
            <p className="text-gray-700">
              We found the following info for this customer. To proceed, please
              re‑enter their Document Number and Expiration Date for
              verification.
            </p>

            {/* Prominent Display Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <p className="text-sm text-gray-600">Location</p>
                <p className="mt-1 font-medium text-gray-900">
                  {foundRecord.location}
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50">
                <p className="text-sm text-gray-600">Email</p>
                <p className="mt-1 font-medium text-gray-900">
                  {foundRecord.email}
                </p>
              </div>
            </div>

            {/* Input Fields */}
            <form onSubmit={handleContinueRecovery} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Number
                  </label>
                  <input
                    type="text"
                    value={formData.docNumber}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        docNumber: e.target.value,
                      }))
                    }
                    placeholder="Enter document number"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      setFormData((f) => ({
                        ...f,
                        expirationDate: e.target.value,
                      }))
                    }
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center sm:justify-end">
                <button
                  type="submit"
                  className="px-10 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue Recovery Process
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
