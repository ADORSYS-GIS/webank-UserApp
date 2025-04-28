import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQrcode,
  faMoneyCheckAlt,
  faArrowLeft,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/Store";

interface AgentPageProps {
  onClose?: () => void;
}

const AgentPage: React.FC<AgentPageProps> = ({ onClose }) => {
  const navigate = useNavigate();
  const accountId = useSelector((state: RootState) => state.account.accountId);
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = (callback?: () => void) => {
    setIsOpen(false);
    setTimeout(() => {
      onClose?.();
      callback?.();
    }, 300);
  };

  useEffect(() => {
    setIsOpen(true);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-end justify-center">
      <div
        className={`bg-white rounded-t-2xl w-full max-w-md transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "90vh" }}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
          <button
            onClick={() => handleClose()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClose();
              }
            }}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Back to Dashboard"
            tabIndex={0}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="lg" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Agent Services
          </h1>
          <button
            onClick={() => handleClose()}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleClose();
              }
            }}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
            tabIndex={0}
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 70px)" }}
        >
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() =>
                handleClose(() =>
                  navigate("/qr-scan", {
                    state: {
                      agentAccountId: accountId,
                      agentAccountCert: accountCert,
                      show: "Top up",
                    },
                  }),
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClose(() =>
                    navigate("/qr-scan", {
                      state: {
                        agentAccountId: accountId,
                        agentAccountCert: accountCert,
                        show: "Top up",
                      },
                    }),
                  );
                }
              }}
              className="flex flex-col items-center cursor-pointer group p-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-50 group-hover:bg-blue-100 transition-colors mb-2">
                <FontAwesomeIcon
                  icon={faQrcode}
                  className="text-blue-500 text-xl"
                />
              </div>
              <span className="font-medium text-gray-800">Cash-In</span>
              <span className="text-xs text-center text-gray-500 mt-1">
                Scan QR code to receive payments
              </span>
            </button>

            <button
              onClick={() =>
                handleClose(() =>
                  navigate("/top-up", {
                    state: {
                      show: "Pay out",
                      agentAccountId: accountId,
                      agentAccountCert: accountCert,
                    },
                  }),
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClose(() =>
                    navigate("/top-up", {
                      state: {
                        show: "Pay out",
                        agentAccountId: accountId,
                        agentAccountCert: accountCert,
                      },
                    }),
                  );
                }
              }}
              className="flex flex-col items-center cursor-pointer group p-4 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              tabIndex={0}
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-50 group-hover:bg-green-100 transition-colors mb-2">
                <FontAwesomeIcon
                  icon={faMoneyCheckAlt}
                  className="text-green-500 text-xl"
                />
              </div>
              <span className="font-medium text-gray-800">Pay-out</span>
              <span className="text-xs text-center text-gray-500 mt-1">
                Payout cash to customers
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
