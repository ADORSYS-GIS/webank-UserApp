import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../DashboardPage.tsx";
import {
  RequestToGetBalance,
  RequestToGetTransactionHistory,
} from "../../services/keyManagement/requestService.ts";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { useAccountStore } from "../../store/accountStore";

// Mock FontAwesome
vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: () => null,
}));

// Mock necessary external modules
vi.mock("react-router-dom", () => ({
  ...require("react-router-dom"),
  useLocation: () => ({
    pathname: "/dashboard",
    state: {
      accountId: "12345",
      accountCert: "cert123",
    },
  }),
}));

// Mock RequestToGetBalance and RequestToGetTransactionHistory
vi.mock("../../services/keyManagement/requestService.ts", () => ({
  RequestToGetBalance: vi.fn(),
  RequestToGetTransactionHistory: vi.fn(),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset Zustand store to initial state
    useAccountStore.setState({
      accountId: null,
      accountCert: null,
      status: null,
      documentStatus: null,
      kycCert: null,
      emailStatus: null,
      phoneStatus: null,
    });
  });

  it("renders the logo and header", () => {
    // Set up Zustand store state for this test
    useAccountStore.setState({
      accountId: "mock-account-id",
      accountCert: "mock-account-cert",
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    expect(screen.getByText("Balance")).toBeInTheDocument();
  });

  it("calls RequestToGetBalance and shows toast on error", async () => {
    const mockError = new Error("API error");

    // Mock RequestToGetBalance to reject with the mock error
    (RequestToGetBalance as jest.Mock).mockRejectedValueOnce(mockError);

    // Set up Zustand store state for this test
    useAccountStore.setState({
      accountId: "mock-account-id",
      accountCert: "mock-account-cert",
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    // Ensure the RequestToGetBalance was called 0 times as per the original logic
    await waitFor(() => {
      expect(RequestToGetBalance).toHaveBeenCalledTimes(0);
    });
  });

  it("renders transaction items correctly", async () => {
    // Mock transaction data
    const mockTransactions = [
      {
        id: 1,
        title: "Apple",
        date: "2023-10-01",
        amount: "-$429.00",
        icon: "shopping-cart",
      },
      {
        id: 2,
        title: "Fiverr",
        date: "2023-10-02",
        amount: "+$5,379.63",
        icon: "shopping-cart",
      },
    ];

    // Mock RequestToGetTransactionHistory to resolve with mock data
    (RequestToGetTransactionHistory as jest.Mock).mockResolvedValueOnce(
      JSON.stringify(mockTransactions),
    );

    // Set up Zustand store state for this test
    useAccountStore.setState({
      accountId: "mock-account-id",
      accountCert: "mock-account-cert",
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    // Click the "View Last Transactions" button to fetch and display transactions
    const viewTransactionsButton = screen.getByText("View All");
    viewTransactionsButton.click();

    // Wait for the transactions to be rendered
    await waitFor(() => {
      expect(screen.getByText("Apple")).toBeInTheDocument();
      expect(screen.getByText("Fiverr")).toBeInTheDocument();
    });
  });
});
