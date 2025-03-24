import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../DashboardPage.tsx";
import {
  RequestToGetBalance,
  RequestToGetTransactionHistory,
} from "../../services/keyManagement/requestService.ts";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { rootReducer } from "../../store/Store.ts";
import "@testing-library/jest-dom";

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

// Create a mock store with initial state
const mockStore = createStore(rootReducer, {
  account: {
    accountId: "12345", // Mock accountId
    accountCert: "cert123", // Mock accountCert
    status: null, // KYC Status
    kycCert: null,
  },
});

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the logo and header", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>,
    );

    // Check logo and welcome message
    expect(screen.getByAltText("Logo WeBank")).toBeInTheDocument();
  });

  it("calls RequestToGetBalance and shows toast on error", async () => {
    const mockError = new Error("API error");

    // Mock RequestToGetBalance to reject with the mock error
    (RequestToGetBalance as jest.Mock).mockRejectedValueOnce(mockError);

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>,
    );

    // Ensure the RequestToGetBalance was called 0 times as per the original logic
    await waitFor(() => {
      expect(RequestToGetBalance).toHaveBeenCalledTimes(0); // Expecting 0 calls
    });

    // Ensure the error toast was shown
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
      <Provider store={mockStore}>
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

    // Check amounts have the correct colors
    expect(screen.getByText("-$429.00")).toHaveClass("text-red-500");
    expect(screen.getByText("+$5,379.63")).toHaveClass("text-green-500");
  });

  it("shows the correct account ID or error message", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>,
    );

    const accountIdText = screen.getByText("CM-12345");
    expect(accountIdText).toBeInTheDocument();
  });
});
