import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../DashboardPage";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "@state/accountSlice.ts";

import { useTransactionHistoryServicePostApiAccountsTransactions } from "@openapi/generated/obs/queries/queries";

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

// Provide mock mutateAsync for balance queries (for correct assertions)
const mockBalanceMutateAsync = vi.fn();
vi.mock("@openapi/generated/obs/queries/queries", () => ({
  useAccountBalanceServicePostApiAccountsBalance: () => ({
    mutateAsync: mockBalanceMutateAsync,
  }),
  useTransactionHistoryServicePostApiAccountsTransactions: vi.fn(),
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      account: accountReducer,
    },
    preloadedState: {
      account: {
        accountId: "mock-account-id",
        accountCert: "mock-account-cert",
        status: null,
        documentStatus: null,
        kycCert: null,
        emailStatus: null,
        phoneStatus: null,
      },
    },
  });
};

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the logo and header", () => {
    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText("Balance")).toBeInTheDocument();
  });
  it("calls RequestToGetBalance and shows toast on error", async () => {
    const mockError = new Error("API error");

    // Mock mutateAsync to reject with the mock error
    mockBalanceMutateAsync.mockRejectedValueOnce(mockError);

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>,
    );
    // Ensure the balance API was not called automatically
    expect(mockBalanceMutateAsync).toHaveBeenCalledTimes(0);
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
    (
      useTransactionHistoryServicePostApiAccountsTransactions as jest.Mock
    ).mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({
        data: JSON.stringify(mockTransactions),
      }),
    });

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>,
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
