import { useNavigate } from "react-router-dom";

interface NoContentStateProps {
  storeTestData: () => void;
}

export default function NoContentState({ storeTestData }: NoContentStateProps) {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-4 text-center">
      <div className="text-gray-500">
        <h2 className="text-xl font-semibold mb-2">No Content Found</h2>
        <p className="mb-4">The shared content could not be loaded.</p>
        <button
          onClick={storeTestData}
          className="bg-green-100 text-green-800 px-6 py-2 rounded-lg hover:bg-green-200 mr-4"
        >
          Load Test Data
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-[#20B2AA] text-white px-6 py-2 rounded-lg hover:bg-[#1C8C8A] transition"
        >
          Return to Home
        </button>
      </div>
    </div>
  );
}
