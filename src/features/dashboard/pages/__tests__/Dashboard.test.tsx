import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "../DashboardPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock FontAwesome
vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => null,
}));

// Mock Zustand store
vi.mock("@state/accountStore", () => ({
  useAccountStore: vi.fn(() => ({
    accountId: "mock-account-id",
    accountCert: "mock-account-cert",
    status: null,
    documentStatus: null,
    kycCert: null,
    emailStatus: null,
    phoneStatus: null,
  })),
}));

// Mock API requests
vi.mock("@services/keyManagement/requestService", () => ({
  RequestToGetBalance: vi.fn(),
  RequestToGetTransactionHistory: vi.fn(),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dashboard with account information", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    // Add your assertions here
    expect(screen.getByText(/Balance/i)).toBeInTheDocument();
  });

  // Add more test cases as needed
});
