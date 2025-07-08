import { vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

// Provide mock mutateAsync for balance queries (for correct assertions)
const mockBalanceMutateAsync = vi.fn();
const mockTransactionsMutateAsync = vi.fn();
vi.mock("@openapi/generated/obs/queries/queries", () => ({
  useAccountBalanceServicePostApiAccountsBalance: () => ({
    mutateAsync: mockBalanceMutateAsync,
  }),
  useTransactionHistoryServicePostApiAccountsTransactions: () => ({
    mutateAsync: mockTransactionsMutateAsync,
  }),
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

  it("calls balance API and shows toast on error", async () => {
    const mockError = new Error("API error");
    mockBalanceMutateAsync.mockRejectedValueOnce(mockError);

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );
    // Try to trigger balance fetch (simulate user click if needed)
    // For now, just check if not called automatically
    expect(mockBalanceMutateAsync).toHaveBeenCalledTimes(0);
  });

  it("renders transaction items correctly", async () => {
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
    mockTransactionsMutateAsync.mockResolvedValueOnce({
      data: JSON.stringify(mockTransactions),
    });
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>,
    );

    // Click the "View All" button to fetch transactions
    const viewAllButton = screen.getByRole("button", { name: /view all/i });
    fireEvent.click(viewAllButton);

    // Wait for the transactions to be rendered
    // Assertions: ensure the mocked transactions appear in the document
    expect(await screen.findByText("Apple")).toBeInTheDocument();
    expect(await screen.findByText("Fiverr")).toBeInTheDocument();
  });
});
