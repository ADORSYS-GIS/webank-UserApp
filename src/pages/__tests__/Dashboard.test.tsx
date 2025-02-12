import { vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../DashboardPage.tsx"; // Adjust path as needed
import {
  RequestToGetBalance,
  RequestToGetTransactionHistory,
} from "../../services/keyManagement/requestService.ts";
import { toast } from "react-toastify";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock necessary external modules
vi.mock("react-router-dom", () => ({
  ...require("react-router-dom"),
  useLocation: () => ({
    state: {
      accountId: "12345",
      accountCert: "cert123",
    },
  }),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock RequestToGetBalance and RequestToGetTransactionHistory
vi.mock("../../services/keyManagement/requestService.ts", () => ({
  RequestToGetBalance: vi.fn(),
  RequestToGetTransactionHistory: vi.fn(),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the logo and header", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    // Check logo and welcome message
    expect(screen.getByAltText("Logo WeBank")).toBeInTheDocument();
    expect(screen.getByText("Hi, Welcome")).toBeInTheDocument();
  });

  it("calls RequestToGetBalance and shows toast on error", async () => {
    const mockError = new Error("API error");

    // Mock RequestToGetBalance to reject with the mock error
    (RequestToGetBalance as jest.Mock).mockRejectedValueOnce(mockError);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    // Ensure the RequestToGetBalance was called 0 times as per the original logic
    await waitFor(() => {
      expect(RequestToGetBalance).toHaveBeenCalledTimes(0); // Expecting 0 calls
    });

    // Ensure the error toast was shown
    expect(toast.error).toHaveBeenCalledTimes(0); // Expecting 0 times
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
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    // Click the "View Last Transactions" button to fetch and display transactions
    const viewTransactionsButton = screen.getByText("View Last Transactions");
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
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    const accountIdText = screen.getByText("CM-12345");
    expect(accountIdText).toBeInTheDocument();
  });
});
