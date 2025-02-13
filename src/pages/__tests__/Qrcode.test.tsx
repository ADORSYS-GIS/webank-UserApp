import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QRGenerator from "../Qrcode";
import { QRCodeCanvas } from "qrcode.react";

// Mock QRCodeCanvas component
vi.mock("qrcode.react", () => ({
  QRCodeCanvas: vi.fn(() => <canvas data-testid="qrcode-canvas" />),
}));

describe("QRGenerator Component", () => {
  const predefinedAccountId = "12345ABC";
  const predefinedAmount = "100";
  const expectedQrValue = JSON.stringify({
    accountId: predefinedAccountId,
    amount: predefinedAmount,
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders QR code with correct values", () => {
    render(<QRGenerator />);

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
    vi.stubGlobal("history", {
      back: mockBack,
    });

    render(<QRGenerator />);

    const backButton = screen.getByRole("button", { name: /back to entry/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledOnce();
  });

  it("matches snapshot", () => {
    const { container } = render(<QRGenerator />);
    expect(container).toMatchSnapshot();
  });
});
