/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FiCreditCard,
  FiClock,
  FiMap,
  FiMail,
  FiArrowLeft,
} from "react-icons/fi";
import { RequestToGetKycRecordsBySearch } from "../../services/keyManagement/requestService";
import { InfoRow } from "../components/InfoRow";

interface UserInfo {
  idNumber: string;
  expirationDate: string;
  location: string;
  email: string;
}

interface UserKYC {
  id: string;
  oldAccountId: string;
  info: UserInfo;
}

export default function RecoveryDashboard() {
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const [user, setUser] = useState<UserKYC | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      setLoading(true);

      if (!accountCert) {
        toast.error("Account authentication missing");
        return;
      }

      const response = await RequestToGetKycRecordsBySearch(
        searchTerm,
        accountCert,
      );

      const parsed = Array.isArray(response)
        ? response
        : JSON.parse(response || "[]");

      if (parsed.length === 0) {
        toast.error("No user found with the provided document number");
        return;
      }

      // Only extract the four fields we care about:
      const info = parsed[0];
      const userKYC: UserKYC = {
        id: info.id,
        oldAccountId: info.accountId,
        info: {
          idNumber: info.idNumber || "",
          expirationDate: info.expirationDate || "",
          location: info.location || "N/A",
          email: info.email || "N/A",
        },
      };

      setUser(userKYC);
    } catch (error) {
      toast.error("Failed to load user data");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueRecovery = () => {
    console.log("OLD ACCOUNT ID: " + user?.oldAccountId);
    navigate("/recovery/getnewid", {
      state: { oldAccountId: user?.oldAccountId },
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

        {/* Search bar */}
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
            {/* Back button */}
            <button
              onClick={() => setUser(null)}
              className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm sm:text-base"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back to Search</span>
            </button>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <InfoRow
                  icon={<FiCreditCard />}
                  label="ID Number"
                  value={user.info.idNumber}
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

              {/* Continue Recovery Process Button */}
              <div className="mt-8 flex justify-center sm:justify-end">
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
    </div>
  );
}
