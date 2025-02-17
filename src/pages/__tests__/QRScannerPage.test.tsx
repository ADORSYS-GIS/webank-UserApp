import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import QRScannerPage from "../QRScannerPage"; // Adjust path as needed
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
  })),
}));

describe("QRScannerPage", () => {
  // Declare mockNavigate here, so it's in the same scope as the tests
  const mockNavigate = vi.fn();

  beforeEach(() => {
    // Clear previous mocks and reset navigate function
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate); // This makes sure the mockNavigate is returned by useNavigate
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

  it("navigates to the dashboard when cancel button is clicked", () => {
    render(
      <MemoryRouter>
        <QRScannerPage />
      </MemoryRouter>,
    );

    // Simulate clicking the cancel button
    fireEvent.click(screen.getByText("Cancel"));

    // Ensure navigation to the dashboard
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
