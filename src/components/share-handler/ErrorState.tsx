import { AlertTriangle } from "react-feather";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  error: string;
  storeTestData: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error, storeTestData }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full py-10">
      <AlertTriangle className="text-red-500 text-5xl mb-4" />
      <h2 className="text-xl font-semibold mb-2">An error occurred</h2>
      <p className="text-gray-600 mb-4">{error}</p>
      <button
        onClick={storeTestData}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Retry
      </button>
      <button
        onClick={() => navigate(-1)}
        className="mt-2 text-blue-500 hover:underline"
      >
        Go Back
      </button>
    </div>
  );
};

export default ErrorState;
