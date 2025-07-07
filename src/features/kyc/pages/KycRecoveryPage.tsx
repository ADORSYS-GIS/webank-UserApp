/* eslint-disable @typescript-eslint/no-explicit-any */
import { ImageModal } from "@features/kyc/components/ImageModal";
import { DocumentCard } from "@features/kyc/components/DocumentCard";
import { FiArrowLeft } from "react-icons/fi";
import { useKycRecoveryDashboard } from "../hooks/useKycRecoveryDashboard";

export default function RecoveryDashboard() {
  const {
    foundRecord,
    setFoundRecord,
    loading,
    searchTerm,
    setSearchTerm,
    formData,
    setFormData,
    navigate,
    selectedImage,
    setSelectedImage,
    getStatusStyles,
    isRecoveryAllowed,
    getStatusMessage,
    handleSearch,
    handleContinueRecovery,
  } = useKycRecoveryDashboard();

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        {foundRecord ? "Validating details…" : "Searching…"}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-8">
      <button
        onClick={() => navigate("/dashboard")}
        className="p-2 rounded-full hover:bg-gray-100 transition"
        aria-label="Close form"
      >
        <FiArrowLeft className="w-6 h-6 text-gray-600" />
      </button>

      <div className="max-w-3xl mx-auto">
        <h1
          className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent
            bg-gradient-to-r from-blue-600 to-cyan-500 mb-8 text-center drop-shadow-sm"
        >
          Recovery Process
        </h1>

        {/* Step1: Search Form */}
        {!foundRecord && (
          <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
              <input
                type="text"
                placeholder="Enter Document Number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-full
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  placeholder-gray-400 text-lg transition"
              />
              <button
                onClick={handleSearch}
                className="px-8 py-4 bg-blue-600 text-white rounded-full
                  hover:bg-blue-700 transition-all shadow-md"
              >
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
        )}

        {/* Step2: Validation Form + Display of document details */}
        {foundRecord && (
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 space-y-6">
            {/* Header row: Back button on left, Status badge on right */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setFoundRecord(null)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800
                  p-2 rounded-full hover:bg-gray-100 transition"
              >
                <FiArrowLeft className="w-5 h-5" />
                Back to Search
              </button>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full 
                  ${getStatusStyles(foundRecord.status)}`}
              >
                {foundRecord.status.toUpperCase()}
              </span>
            </div>
            {/* Instruction */}
            <p className="text-gray-700">
              We found the following info for this customer. To proceed, please
              re‑enter their Document Number and Expiration Date for
              verification.
            </p>

            {/* Prominent Display Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <p className="text-sm text-gray-600">Location</p>
                <p className="mt-1 font-medium text-gray-900">
                  {foundRecord.location}
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-blue-50">
                <p className="text-sm text-gray-600">Email</p>
                <p className="mt-1 font-medium text-gray-900">
                  {foundRecord.email}
                </p>
              </div>
            </div>

            {/* Display Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DocumentCard
                  title="Front ID"
                  url={foundRecord.frontID ?? ""}
                  type="image"
                  onImageClick={setSelectedImage}
                />
                <DocumentCard
                  title="Back ID"
                  url={foundRecord.backID ?? ""}
                  type="image"
                  onImageClick={setSelectedImage}
                />
                <DocumentCard
                  title="Selfie"
                  url={foundRecord.selfie ?? ""}
                  type="image"
                  onImageClick={setSelectedImage}
                />
                <DocumentCard
                  title="Tax Document"
                  url={foundRecord.taxDocument ?? ""}
                  type="image"
                  onImageClick={setSelectedImage}
                />
              </div>
            </div>

            {/* Input Fields */}
            <form onSubmit={handleContinueRecovery} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="docNumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Document Number
                  </label>
                  <input
                    id="docNumber"
                    type="text"
                    value={formData.docNumber}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        docNumber: e.target.value,
                      }))
                    }
                    placeholder="Enter document number"
                    className="w-full px-6 py-4 border-2 border-gray-200
                      rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      placeholder-gray-400 transition"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="expirationDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Expiration Date
                  </label>
                  <input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) =>
                      setFormData((f) => ({
                        ...f,
                        expirationDate: e.target.value,
                      }))
                    }
                    className="w-full px-6 py-4 border-2 border-gray-200
                      rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                      placeholder-gray-400 transition"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-center sm:justify-end">
                {isRecoveryAllowed() ? (
                  <button
                    type="submit"
                    className="px-10 py-4 bg-blue-600 text-white rounded-full 
                      hover:bg-blue-700 transition-all shadow-md"
                  >
                    Continue Recovery Process
                  </button>
                ) : (
                  <div
                    className="px-10 py-4 bg-gray-300 text-white rounded-full 
                      shadow-lg cursor-not-allowed"
                  >
                    {getStatusMessage()}
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
      {/* Image Modal Component */}
      <ImageModal
        selectedImage={selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
