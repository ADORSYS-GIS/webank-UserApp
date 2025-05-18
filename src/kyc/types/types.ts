export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserKYC {
  id: string;
  accountId: string;
  docNumber: string;
  expirationDate: string;
  location: string;
  email: string;
  status: KycStatus;
  frontID: string;
  backID: string;
  selfie: string;
  taxDocument: string;
}

export interface KycBackendResponse {
  id?: string;
  documentUniqueId?: string;
  accountId?: string;
  idNumber?: string;
  expirationDate?: string;
  location?: string;
  email?: string;
  status?: string;
  frontID?: string;
  backID?: string;
  selfie?: string;
  taxDocument?: string;
}

export interface VerificationFormData {
  accountId: string;
  docNumber: string;
  expirationDate: string;
}
