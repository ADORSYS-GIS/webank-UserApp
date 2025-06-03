export interface RecoveredTokensProjection {
  oldAccountId: string;
  newKycCertificate: string;
  message: string;
}

export const toRecoveredTokensProjection = (data: any): RecoveredTokensProjection => {
  return {
    oldAccountId: data.oldAccountId,
    newKycCertificate: data.newKycCertificate,
    message: data.message
  };
}; 