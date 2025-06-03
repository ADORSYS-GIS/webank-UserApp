import { describe, it, expect } from 'vitest';
import { RecoveredTokensProjection, toRecoveredTokensProjection } from '../RecoveredTokensProjection';

describe('RecoveredTokensProjection', () => {
  it('should convert data to RecoveredTokensProjection', () => {
    const data = {
      oldAccountId: '123',
      newKycCertificate: 'cert123',
      message: 'Recovery successful'
    };

    const projection = toRecoveredTokensProjection(data);

    expect(projection).toEqual({
      oldAccountId: '123',
      newKycCertificate: 'cert123',
      message: 'Recovery successful'
    });
  });
}); 