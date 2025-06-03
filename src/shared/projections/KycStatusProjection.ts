export type KycStatusProjection = "PENDING" | "APPROVED" | "REJECTED";

export const toKycStatusProjection = (status: string): KycStatusProjection => {
  if (status === "PENDING" || status === "APPROVED" || status === "REJECTED") {
    return status;
  }
  throw new Error(`Invalid KYC status: ${status}`);
}; 