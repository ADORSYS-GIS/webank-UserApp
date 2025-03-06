import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AccountQR from "../AccountQr";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from "react-redux";

// Mock QRCodeCanvas component
vi.mock("qrcode.react", () => ({
  QRCodeCanvas: vi.fn(() => <canvas data-testid="qrcode-canvas" />),
}));

// Mock useSelector to return a predefined accountId
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

describe("AccountQR Component", () => {
  const mockAccountID = "12345ABC";
  const expectedQrValue = JSON.stringify({
    accountId: mockAccountID,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    (useSelector as unknown as jest.Mock).mockReturnValue(mockAccountID);
  });

  it("renders QR code with correct values", () => {
    render(<AccountQR />);

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

    render(<AccountQR />);

    const backButton = screen.getByRole("button", { name: /← Back/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledOnce();
  });
});
