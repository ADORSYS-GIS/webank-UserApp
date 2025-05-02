// components/PendingKycList.tsx - Extracted component for the pending list
import React from "react";
import { UserKYC } from "../types/types";

interface PendingKycListProps {
  users: UserKYC[];
  loading: boolean;
  onSelectUser: (user: UserKYC) => void;
}

export const PendingKycList: React.FC<PendingKycListProps> = ({
  users,
  loading,
  onSelectUser,
}) => {
  if (loading) {
    return (
      <div className="text-center text-gray-500">
        Loading pending requests...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center text-gray-500">No pending verifications</div>
    );
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex justify-between items-center p-4
            border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div>
            <p className="text-sm text-gray-600">AccountId: {user.accountId}</p>
          </div>
          <button
            onClick={() => onSelectUser(user)}
            className="px-4 py-2 bg-blue-600 text-white rounded-full
              hover:bg-blue-700 transition-colors"
            type="button"
          >
            Review
          </button>
        </div>
      ))}
    </div>
  );
};
