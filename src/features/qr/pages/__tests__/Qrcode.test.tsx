import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QRGenerator from "../Qrcode";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock QRCodeCanvas component
vi.mock("qrcode.react", () => ({
  QRCodeCanvas: vi.fn(() => <canvas data-testid="qrcode-canvas" />),
}));

// Mock useLocation hook from react-router-dom
vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(),
  useNavigate: vi.fn(),
}));

// Mock Zustand store
vi.mock("@state/accountStore", () => ({
  useAccountStore: () => ({
    accountId: "mock-account-id",
    accountCert: "mock-cert",
  }),
}));

describe("QRGenerator Component", () => {
  const mockTotalAmount = "100";
  const mockTimeGenerated = Date.now() - 60000;
  const expectedQrValue = JSON.stringify({
    accountId: "mock-account-id",
    amount: mockTotalAmount,
    timeGenerated: mockTimeGenerated,
  });

  beforeEach(() => {
    vi.clearAllMocks();

    (useLocation as jest.Mock).mockReturnValue({
      state: { totalAmount: mockTotalAmount },
    });

    vi.spyOn(Date, "now").mockReturnValue(mockTimeGenerated);
  });

  it("renders QR code with correct values", () => {
    render(<QRGenerator />);

    expect(QRCodeCanvas).toHaveBeenCalledWith(
      expect.objectContaining({
        value: expectedQrValue,
        level: "L",
        size: 250,
      }),
      {},
    );
  });

  it("handles back button click correctly", () => {
    const mockBack = vi.fn();
    vi.stubGlobal("history", { back: mockBack });

    render(<QRGenerator />);

    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledOnce();
  });
});
