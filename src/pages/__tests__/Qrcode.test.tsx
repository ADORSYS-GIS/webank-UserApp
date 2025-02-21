import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QRGenerator from "../Qrcode";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation } from "react-router-dom";

// Mock QRCodeCanvas component
vi.mock("qrcode.react", () => ({
  QRCodeCanvas: vi.fn(() => <canvas data-testid="qrcode-canvas" />),
}));

// Mock useLocation hook from react-router-dom
vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(),
}));

describe("QRGenerator Component", () => {
  const mockTotalAmount = "100";
  const mockAccountID = "12345ABC";
  const expectedQrValue = JSON.stringify({
    accountId: mockAccountID, // Update based on new component key
    amount: mockTotalAmount,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock useLocation to return predefined state values
    (useLocation as jest.Mock).mockReturnValue({
      state: { totalAmount: mockTotalAmount, accountId: mockAccountID },
    });
  });

  it("renders QR code with correct values", () => {
    render(<QRGenerator />);

    // Check if QRCodeCanvas is called with correct props
    expect(QRCodeCanvas).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expectedQrValue,
        size: 250,
      }),
      expect.anything(),
    );
  });

  it("handles back button click correctly", () => {
    const mockBack = vi.fn();
    vi.stubGlobal("history", { back: mockBack });

    render(<QRGenerator />);

    const backButton = screen.getByRole("button", { name: /back to entry/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledOnce();
  });
});
