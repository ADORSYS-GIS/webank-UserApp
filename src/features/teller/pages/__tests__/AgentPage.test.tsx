import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import AgentPage from "../AgentPage";
import { vi } from "vitest";

// Mock Zustand store
vi.mock("@state/accountStore", () => ({
  useAccountStore: () => ({
    accountId: "test-account-id",
    accountCert: "test-account-cert",
    status: null,
    documentStatus: null,
    kycCert: null,
    emailStatus: null,
    phoneStatus: null,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AgentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders agent page with navigation options", () => {
    render(<AgentPage />);

    expect(screen.getByText("Agent Services")).toBeInTheDocument();
  });

  test("renders Cash-In button and description", () => {
    render(<AgentPage />);
    expect(
      screen.getByText(/Scan QR code to receive payments/i),
    ).toBeInTheDocument();
  });

  test("renders Pay-out button and description", () => {
    render(<AgentPage />);

    expect(screen.getByText("Pay-out")).toBeInTheDocument();
    expect(
      screen.getByText("Help customers withdraw offline"),
    ).toBeInTheDocument();
  });

  test("Cash-In button triggers navigation", async () => {
    render(<AgentPage />);

    const cashInButton = screen.getByText("Cash-In");
    fireEvent.click(cashInButton);

    // Wait for the handleClose callback to execute
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check if navigate was called with the correct arguments
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/qr-scan/top-up",
      state: {
        agentAccountId: "test-account-id",
        agentAccountCert: "test-account-cert",
      },
    });
  });
});
