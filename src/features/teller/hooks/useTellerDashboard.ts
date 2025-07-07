import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@state/Store";
import { toast } from "sonner";
import { RequestToGetOtps } from "@services/keyManagement/requestService";

export interface OtpData {
  phoneNumber: string;
  otpCode: string;
  status: string;
}

export function useTellerDashboard() {
  const [data, setData] = useState<OtpData[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const accountCert = useSelector((state: RootState) => state.account.accountCert);

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
          : (JSON.parse(fetchedData || "[]") as OtpData[]);
        setData(parsedData);
      } catch (error) {
        toast.error("Failed to retrieve otpCode requests. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [accountCert]);

  const updateStatus = (phoneNumber: string, newStatus: string) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.phoneNumber === phoneNumber
          ? { ...item, status: newStatus }
          : item,
      ),
    );
  };

  const handleSendWhatsApp = (phoneNumber: string, otpCode: string) => {
    const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=Your%20otpCode%20is%20${otpCode}`;
    window.open(url, "_blank");
  };

  return {
    data,
    setData,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    loading,
    itemsPerPage,
    updateStatus,
    handleSendWhatsApp,
  };
}
