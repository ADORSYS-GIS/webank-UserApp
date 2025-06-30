import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RequestToGetUserLocation } from "../../services/keyManagement/requestService";
import { useSelector } from "react-redux";
import { RootState } from "../../store/Store";
import { toast } from "sonner";

interface GeoLocation {
  lat: number;
  lng: number;
}

const MapConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const coords = (location.state as { coords: GeoLocation })?.coords;
  const accountCert = useSelector(
    (state: RootState) => state.account.accountCert,
  );
  const accountId = useSelector((state: RootState) => state.account.accountId);

  useEffect(() => {
    if (!coords) navigate("/location-verification");

    // Get city name using reverse geocoding
    const getCityName = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`,
        );
        const data = await response.json();
        setCity(data.address.city || data.address.town || data.address.village);
      } catch (error) {
        console.error("Error fetching city name:", error);
      }
    };

    getCityName();
  }, [coords, navigate]);

  const sendToBackend = async () => {
    if (!accountCert || !accountId || !coords) return;

    try {
      setIsSubmitting(true);
      await RequestToGetUserLocation(
        accountCert,
        `${coords.lat},${coords.lng}`,
        accountId,
      );
      toast.success("Location verified!");
      setTimeout(() => {
        navigate("/under-review");
      }, 3000);
    } catch (error) {
      setError("Verification failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!coords) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Confirm Your Location
        </h1>

        <div className="relative mb-6 rounded-lg overflow-hidden border border-gray-200">
          <div className="h-64 bg-gray-100 flex items-center justify-center">
            <iframe
              width="100%"
              height="100%"
              title="OSM Map"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.02}%2C${coords.lat - 0.02}%2C${coords.lng + 0.02}%2C${coords.lat + 0.02}&layer=mapnik&marker=${coords.lat}%2C${coords.lng}`}
            />
          </div>
          {city && (
            <div className="absolute top-2 left-2 bg-white px-3 py-1 rounded-md shadow-sm text-sm font-medium text-gray-700 border border-gray-200">
              📍 {city}
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-6 text-center">
          Does this area match your current residential location?
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col space-y-4">
          <button
            onClick={sendToBackend}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Yes, this is my location"}
          </button>
          <button
            onClick={() => navigate("/verification/location")}
            className="text-gray-600 px-6 py-3 rounded-md hover:bg-gray-100 transition-colors"
          >
            No, this is incorrect
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapConfirmation;
