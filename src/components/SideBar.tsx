// src/components/SideBar.tsx
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faHome,
  // Additional icons if needed
} from "@fortawesome/free-solid-svg-icons";

const Sidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-full bg-gradient-to-b from-purple-500 to-blue-600 p-4 shadow-lg">
      <div className="mb-8">
        <h2 className="text-white text-xl font-bold">Webank Portal</h2>
      </div>
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center p-3 rounded-lg ${
                location.pathname === "/dashboard"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              } transition-colors text-white`}
            >
              <FontAwesomeIcon icon={faHome} className="mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/agent"
              className={`flex items-center p-3 rounded-lg ${
                location.pathname === "/agent"
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              } transition-colors text-white`}
            >
              <FontAwesomeIcon icon={faUserTie} className="mr-3" />
              Agent Services
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
