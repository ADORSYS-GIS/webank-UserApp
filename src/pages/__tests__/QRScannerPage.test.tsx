import { vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import QRScannerPage from "../QRScannerPage";
import { MemoryRouter, useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock the necessary external modules
vi.mock("react-router-dom", () => ({
  ...require("react-router-dom"),
  useNavigate: vi.fn(),
}));

// Mock the Html5Qrcode module with named exports
vi.mock("html5-qrcode", () => ({
  Html5Qrcode: vi.fn().mockImplementation(() => ({
    start: vi.fn().mockResolvedValueOnce("start"),
    stop: vi.fn().mockResolvedValueOnce("stop"),
    getState: vi.fn().mockReturnValue("NOT_STARTED"),
  })),
  Html5QrcodeScannerState: {
    NOT_STARTED: "NOT_STARTED",
    STARTED: "STARTED",
  },
}));

describe("QRScannerPage", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    cleanup(); // Ensure proper cleanup after each test
  });

  it("renders the QR scanner page", () => {
    render(
      <MemoryRouter>
        <QRScannerPage />
      </MemoryRouter>,
    );

    // Check if elements related to the page are rendered
    expect(screen.getByText("Scan Client QR Code")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("navigates to the dashboard when cancel button is clicked", async () => {
    render(
      <MemoryRouter>
        <QRScannerPage />
      </MemoryRouter>,
    );

    // Simulate clicking the cancel button
    fireEvent.click(screen.getByText("Cancel"));

    // Ensure navigation to the dashboard
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard", {
      state: { agentAccountId: undefined, agentAccountCert: undefined },
    });
  });
});
