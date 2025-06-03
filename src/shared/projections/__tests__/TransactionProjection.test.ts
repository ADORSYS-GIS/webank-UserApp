import { describe, it, expect } from 'vitest';
import { TransactionProjection, toTransactionProjection } from '../TransactionProjection';

describe('TransactionProjection', () => {
  it('should convert data to TransactionProjection', () => {
    const data = {
      id: 1,
      date: 1234567890,
      amount: '100.00',
      title: 'Test Transaction'
    };

    const projection = toTransactionProjection(data);

    expect(projection).toEqual({
      id: 1,
      date: 1234567890,
      amount: '100.00',
      title: 'Test Transaction'
    });
  });
}); 