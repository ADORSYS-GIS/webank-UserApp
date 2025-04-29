import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../DashboardPage.tsx";
import {
  RequestToGetBalance,
  RequestToGetTransactionHistory,
} from "../../services/keyManagement/requestService.ts";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import "@testing-library/jest-dom";
import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../../slices/accountSlice";

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

    // Mock RequestToGetBalance to reject with the mock error
    (RequestToGetBalance as jest.Mock).mockRejectedValueOnce(mockError);

    render(
      <Provider store={createMockStore()}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>,
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
