import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface GeoLocation {
  lat: number;
  lng: number;
}

const LocationComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    setIsLoading(true);
    setError(null);

    const handleSuccess = (position: GeolocationPosition) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      console.log("Coordinates:", coords);
      setLocation(coords);
      setIsLoading(false);

      // Verify coordinates make sense
      if (Math.abs(coords.lat) > 90 || Math.abs(coords.lng) > 180) {
        setError("Invalid location coordinates");
        return;
      }

      navigate("/dashboard");
    };

    const handleError = (err: GeolocationPositionError) => {
      setIsLoading(false);
      console.error("Geolocation error:", err);

      switch (err.code) {
        case err.PERMISSION_DENIED:
          setError(
            "Location access denied. Please enable permissions in your browser settings.",
          );
          break;
        case err.POSITION_UNAVAILABLE:
          setError("Location information is unavailable.");
          break;
        case err.TIMEOUT:
          setError(
            "Location request timed out. Please ensure you have GPS enabled.",
          );
          break;
        default:
          setError("Unable to retrieve your location.");
      }
    };

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Location Verification
        </h1>

        <p className="text-gray-600 mb-6">
          Are you currently at your primary residence? We need to verify your
          location as part of the KYC process.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleContinue}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying Location...{" "}
              </>
            ) : (
              "Continue with KYC Verification"
            )}
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="text-gray-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>

        {location && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              Retrieved location:{" "}
              <span className="block font-mono mt-1">
                Latitude: {location.lat.toFixed(6)}, Longitude:{" "}
                {location.lng.toFixed(6)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationComponent;
