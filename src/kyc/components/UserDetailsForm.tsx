// components/UserDetailsForm.tsx - Component for user details and verification form
import React from "react";
import { FiArrowLeft } from "react-icons/fi";
import { DocumentCard } from "./DocumentCard";
import { UserKYC, VerificationFormData } from "../types/types";
import { getStatusClass } from "../utils/kycUtils";

interface UserDetailsFormProps {
  user: UserKYC;
  formData: VerificationFormData;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGoBack: () => void;
  onApprove: (e: React.FormEvent) => Promise<void>;
  onReject: () => void;
  onImageClick: (url: string) => void;
}

export const UserDetailsForm: React.FC<UserDetailsFormProps> = ({
  user,
  formData,
  onInputChange,
  onGoBack,
  onApprove,
  onReject,
  onImageClick,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">KYC Details</h2>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium 
            ${getStatusClass(user.status)}`}
          >
            {user.status}
          </span>
        </div>
        <button
          onClick={onGoBack}
          className="p-2 rounded-full hover:bg-gray-100 transition"
          type="button"
          aria-label="Back to list"
        >
          <FiArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <p className="text-gray-700">
        We found the following info for this customer. To proceed, please
        re‑enter their Document Number and Expiration Date for verification.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg bg-blue-50">
          <p className="text-sm text-gray-600">Location</p>
          <p className="mt-1 font-medium text-gray-900">{user.location}</p>
        </div>
        <div className="p-4 border rounded-lg bg-blue-50">
          <p className="text-sm text-gray-600">Email</p>
          <p className="mt-1 font-medium text-gray-900">{user.email}</p>
        </div>
      </div>

      <form onSubmit={onApprove} className="space-y-6">
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
              onChange={onInputChange}
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
              onChange={onInputChange}
              className="w-full px-6 py-4 border-2 border-gray-200
                rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500
                placeholder-gray-400 transition"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocumentCard
            key="front-id"
            title="Front ID"
            url={user.frontID}
            type="image"
            onImageClick={onImageClick}
          />
          <DocumentCard
            key="back-id"
            title="Back ID"
            url={user.backID}
            type="image"
            onImageClick={onImageClick}
          />
          <DocumentCard
            key="selfie"
            title="Selfie"
            url={user.selfie}
            type="image"
            onImageClick={onImageClick}
          />
          <DocumentCard
            key="tax-doc"
            title="Tax Document"
            url={user.taxDocument}
            type="image"
            onImageClick={onImageClick}
          />
        </div>

        <div className="flex justify-end space-x-4">
          {user.status === "PENDING" ? (
            <>
              <button
                type="button"
                onClick={onReject}
                className="px-10 py-4 bg-rose-600 text-white rounded-full 
                  hover:bg-rose-700 transition-colors"
              >
                Reject
              </button>
              <button
                type="submit"
                className="px-10 py-4 bg-blue-600 text-white rounded-full 
                  hover:bg-blue-700 transition-colors"
              >
                Approve
              </button>
            </>
          ) : (
            <div className="px-10 py-4 bg-gray-300 text-white rounded-full"></div>
          )}
        </div>
      </form>
    </div>
  );
};
