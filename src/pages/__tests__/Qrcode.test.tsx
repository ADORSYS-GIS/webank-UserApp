import { fireEvent, render, screen } from '@testing-library/react';
import { QRCodeCanvas } from 'qrcode.react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Component as QRGenerator } from '../Qrcode';

// Mock QRCodeCanvas component
vi.mock('qrcode.react', () => ({
  QRCodeCanvas: vi.fn(() => <canvas data-testid='qrcode-canvas' />),
}));

// Mock useLocation hook from react-router
vi.mock('react-router', () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

// Mock useSelector to return a predefined accountId
vi.mock('react-redux', () => ({
  useSelector: vi.fn(),
}));

describe('QRGenerator Component', () => {
  const mockTotalAmount = '100';
  const mockAccountID = '12345ABC';
  const mockTimeGenerated = Date.now() - 60000;
  const expectedQrValue = JSON.stringify({
    accountId: mockAccountID,
    amount: mockTotalAmount,
    timeGenerated: mockTimeGenerated,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    (useLocation as jest.Mock).mockReturnValue({
      state: { totalAmount: mockTotalAmount },
    });

    vi.spyOn(Date, 'now').mockReturnValue(mockTimeGenerated);

    (useSelector as unknown as jest.Mock).mockReturnValue(mockAccountID);
  });

  it('renders QR code with correct values', () => {
    render(<QRGenerator />);

    expect(QRCodeCanvas).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expectedQrValue,
        level: 'L',
        size: 250,
      }),
      expect.anything(),
    );
    expect(QRCodeCanvas).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expectedQrValue,
        level: 'L',
        size: 250,
      }),
      expect.anything(),
    );
  });

  it('handles back button click correctly', () => {
    const mockBack = vi.fn();
    vi.stubGlobal('history', { back: mockBack });

    render(<QRGenerator />);

    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledOnce();
  });
});
