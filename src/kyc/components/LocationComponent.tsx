import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RequestToGetUserLocation } from "../../services/keyManagement/requestService";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";

interface GeoLocation {
  lat: number;
  lng: number;
}

const LocationComponent = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );

  // Function to send location to backend
  const sendToBackend = async (coords: GeoLocation) => {
    if (!accountCert) {
      console.error("Account certificate is missing");
      return;
    }

    const location = `${coords.lat},${coords.lng}`;
    try {
      await RequestToGetUserLocation(accountCert, location);
      console.log("Location sent successfully");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error sending location to backend:", error);
      setError("Failed to send location. Please try again.");
    }
  };

  const handleContinue = () => {
    setIsLoading(true);
    setError(null);
    // prettier-ignore
    navigator.geolocation.getCurrentPosition( //NOSONAR
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("Coordinates:", coords);
        setLocation(coords);
        sendToBackend(coords);
      },
      (err) => {
        console.error("Geolocation error:", err);
        setIsLoading(false);

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
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
    );
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
            {isLoading
              ? "Verifying Location..."
              : "Continue with KYC Verification"}
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
              Retrieved location: {""}
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
