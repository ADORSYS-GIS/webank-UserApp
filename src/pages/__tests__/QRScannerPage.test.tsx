import { vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import QRScannerPage from "../QRScannerPage";
import { MemoryRouter, useNavigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../store/Store"; // Import your Redux store
import "@testing-library/jest-dom";

// Mock necessary external modules
vi.mock("react-router-dom", () => ({
  ...require("react-router-dom"),
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
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

    // Mock useLocation to provide location state
    vi.mocked(useLocation).mockReturnValue({
      state: { agentAccountId: "test-agent-id" },
      key: "",
      pathname: "",
      search: "",
      hash: "",
    });
  });

  afterEach(() => {
    cleanup(); // Ensure proper cleanup after each test
  });

  it("renders the QR scanner page", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <QRScannerPage />
        </MemoryRouter>
      </Provider>,
    );

    // Check if elements related to the page are rendered
    expect(screen.getByText("Scan Client QR Code")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("navigates to the dashboard when cancel button is clicked", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <QRScannerPage />
        </MemoryRouter>
      </Provider>,
    );

    // Simulate clicking the cancel button
    fireEvent.click(screen.getByText("Cancel"));

    // Ensure navigation to the dashboard with proper state
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
