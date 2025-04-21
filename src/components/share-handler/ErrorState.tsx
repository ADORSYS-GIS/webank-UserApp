import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  error: string;
  storeTestData: () => void;
}

export default function ErrorState({ error, storeTestData }: ErrorStateProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-red-500 text-center">
        <FontAwesomeIcon
          icon={faTriangleExclamation}
          className="text-3xl mb-3"
        />
        <h2 className="text-xl font-semibold mb-2">Storage Access Issue</h2>
        <p className="mb-4">{error}</p>

        <div className="grid gap-3 max-w-sm mx-auto">
          <button
            onClick={storeTestData}
            className="bg-green-100 text-green-800 p-3 rounded-lg hover:bg-green-200"
          >
            🧪 Load Test Data
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-100 text-blue-800 p-3 rounded-lg hover:bg-blue-200"
          >
            🔄 Try Again
          </button>
          <button
            onClick={() => {
              window.location.href = `chrome://settings/content/siteDetails?site=${encodeURIComponent(window.location.origin)}`;
            }}
            className="bg-yellow-100 text-yellow-800 p-3 rounded-lg hover:bg-yellow-200"
          >
            ⚙️ Open Browser Settings
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-[#20B2AA] text-white p-3 rounded-lg hover:bg-[#1C8C8A]"
          >
            ← Return to Home
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
          <h3 className="font-bold mb-2">Troubleshooting Steps:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ensure you're not in private/incognito mode.</li>
            <li>Enable third-party cookies in browser settings.</li>
            <li>Click "Load Test Data" to simulate shared content.</li>
            <li>Share a file from your device to this app.</li>
            <li>Ensure the app is running over HTTPS.</li>
            <li>Contact support if the issue persists.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
