import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faHome,
  faMoneyCheckAlt,
} from "@fortawesome/free-solid-svg-icons";

interface SideBarProps {
  accountId: string | undefined;
  accountCert: string | undefined;
}

const Sidebar: React.FC<SideBarProps> = ({ accountId, accountCert }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-64 h-full bg-gradient-to-b from-purple-500 to-blue-600 p-4 shadow-lg">
      <div className="mb-8">
        <h2 className="text-white text-xl font-bold">Webank Portal</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() =>
                navigate("/dashboard", { state: { accountId, accountCert } })
              }
              className={`flex items-center w-full text-left p-3 rounded-lg ${
                location.pathname === "/dashboard"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              } transition-colors text-white`}
            >
              <FontAwesomeIcon icon={faHome} className="mr-3" />
              Dashboard
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                navigate("/agent", {
                  state: {
                    agentAccountId: accountId,
                    agentAccountCert: accountCert,
                  },
                })
              }
              className={`flex items-center w-full text-left p-3 rounded-lg ${
                location.pathname === "/agent"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              } transition-colors text-white`}
            >
              <FontAwesomeIcon icon={faUserTie} className="mr-3" />
              Agent Services
            </button>
          </li>
          {/*  Teller Menu */}
          <li>
            <button
              onClick={() =>
                navigate("/login", {
                  state: {
                    tellerAccountId: accountId,
                    tellerAccountCert: accountCert,
                    redirectTo: "/teller",
                  },
                })
              }
              className={`flex items-center w-full text-left p-3 rounded-lg ${
                location.pathname === "/teller"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              } transition-colors text-white`}
            >
              <FontAwesomeIcon icon={faMoneyCheckAlt} className="mr-3" />
              Teller Services
            </button>
          </li>
          {/*  Agency Menu */}
          <li>
            <button
              onClick={() =>
                navigate("/login", {
                  state: {
                    tellerAccountId: accountId,
                    tellerAccountCert: accountCert,
                    redirectTo: "/agency",
                  },
                })
              }
              className={`flex items-center w-full text-left p-3 rounded-lg ${
                location.pathname === "/agency"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              } transition-colors text-white`}
            >
              <FontAwesomeIcon icon={faUserTie} className="mr-3" />
              KYC Verificaion
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
