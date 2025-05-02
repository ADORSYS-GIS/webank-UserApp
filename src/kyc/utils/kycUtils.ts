// utils/kycUtils.ts - Utility functions
export const getStatusClass = (status: string): string => {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "bg-amber-100 text-amber-800 ring-amber-300";
    case "APPROVED":
      return "bg-emerald-100 text-emerald-800 ring-emerald-300";
    case "REJECTED":
      return "bg-rose-100 text-rose-800 ring-rose-300";
    default:
      return "bg-gray-100 text-gray-800 ring-gray-300";
  }
};
