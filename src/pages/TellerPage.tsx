import { useState, useEffect } from "react";
import { Send, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";
import { toast } from "react-toastify";
import { RequestToGetOtps } from "../services/keyManagement/requestService";

export default function TellerDashboard() {
  const [data, setData] = useState<
    { phoneNumber: string; otpCode: string; status: string }[]
  >([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!accountCert) {
          toast.error("Account information is missing.");
          setLoading(false);
          return;
        }
        const fetchedData = await RequestToGetOtps(accountCert);
        const parsedData = Array.isArray(fetchedData)
          ? fetchedData
          : (JSON.parse(fetchedData || "[]") as {
              phoneNumber: string;
              otpCode: string;
              status: string;
            }[]);

        setData(parsedData);
      } catch (error) {
        toast.error("Failed to retrieve otpCode requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accountCert]);

  const handleSendWhatsApp = (phoneNumber: string, otpCode: string) => {
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Your%20otpCode%20is%20${otpCode}`;
    window.open(url, "_blank");
  };

  const updateStatus = (phoneNumber: string, newStatus: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.phoneNumber === phoneNumber
          ? { ...item, status: newStatus }
          : item,
      ),
    );
  };

  const filteredData = data.filter((item) =>
    item.phoneNumber.toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  let tableContent: React.ReactNode;
  if (loading) {
    tableContent = (
      <tr>
        <td colSpan={3} className="text-center py-4 text-gray-500">
          Loading otpCode requests...
        </td>
      </tr>
    );
  } else if (filteredData.length === 0) {
    tableContent = (
      <tr>
        <td colSpan={3} className="text-center py-4 text-gray-500">
          No otp requests found
        </td>
      </tr>
    );
  } else {
    tableContent = paginatedData.map((item) => (
      <tr key={item.phoneNumber} className="hover:bg-gray-50">
        <td className="whitespace-nowrap px-4 py-4 text-gray-700 sm:px-6">
          {item.phoneNumber}
        </td>
        <td className="px-4 py-4 sm:px-6">
          <button
            onClick={() =>
              updateStatus(
                item.phoneNumber,
                item.status === "Pending" ? "Sent" : "Pending",
              )
            }
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              item.status === "Pending"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            {item.status}
          </button>
        </td>
        <td className="px-4 py-4 sm:px-6 flex items-center gap-4">
          <button
            onClick={() => handleSendWhatsApp(item.phoneNumber, item.otpCode)}
            className="text-green-600 hover:text-green-800 transition-colors"
            title="Send via WhatsApp"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </button>
          <button
            onClick={() => updateStatus(item.phoneNumber, "Sent")}
            disabled={item.status === "Sent"}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Mark as sent"
          >
            <Send
              className={`h-5 w-5 ${
                item.status === "Sent" ? "text-gray-500" : "text-blue-600"
              }`}
            />
          </button>
        </td>
      </tr>
    ));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl bg-white p-4 shadow-lg sm:p-6">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
              Teller Dashboard
            </h1>
            <div className="relative w-full sm:w-96">
              <input
                type="text"
                placeholder="Search phoneNumber number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 pl-4 pr-10 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
              <Search className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6">
                    phoneNumber
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 sm:px-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">{tableContent}</tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && filteredData.length > 0 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <span className="text-sm text-gray-700">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredData.length,
                )}{" "}
                to {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
                of {filteredData.length} entries
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="flex items-center rounded-lg border border-gray-300 px-3 py-1 text-sm">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  disabled={currentPage * itemsPerPage >= filteredData.length}
                  className="rounded-lg border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
