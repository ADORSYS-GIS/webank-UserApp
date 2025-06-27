import React from "react";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex justify-between items-center py-2 border-b border-gray-100">
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-medium text-gray-900">{value || "N/A"}</span>
  </div>
);
