import { describe, it, expect } from 'vitest';
import { KycStatusProjection, toKycStatusProjection } from '../KycStatusProjection';

describe('KycStatusProjection', () => {
  it('should convert valid status to KycStatusProjection', () => {
    expect(toKycStatusProjection('PENDING')).toBe('PENDING');
    expect(toKycStatusProjection('APPROVED')).toBe('APPROVED');
    expect(toKycStatusProjection('REJECTED')).toBe('REJECTED');
  });

  it('should throw error for invalid status', () => {
    expect(() => toKycStatusProjection('INVALID')).toThrow('Invalid KYC status: INVALID');
  });
}); 