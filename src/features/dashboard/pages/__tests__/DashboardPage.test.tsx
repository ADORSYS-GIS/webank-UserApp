import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useNavigate } from "@tanstack/react-router";
import { vi, expect, describe, it, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { toast } from "sonner";

// Mock external dependencies
vi.mock("@tanstack/react-router");
vi.mock("sonner");

// Mock the API hooks
const mockBalanceMutation = { mutateAsync: vi.fn() };
const mockTransactionsMutation = { mutateAsync: vi.fn() };

vi.mock("@openapi/generated/obs/queries/queries", () => ({
  useAccountBalanceServicePostApiAccountsBalance: () => mockBalanceMutation,
  useTransactionHistoryServicePostApiAccountsTransactions: () =>
    mockTransactionsMutation,
}));

// Mock the account store
const mockUseAccountStore = vi.fn();
vi.mock("@state/accountStore", () => ({
  useAccountStore: mockUseAccountStore,
}));

// This will be imported after setting up mocks
import type { ComponentType } from "react";
let DashboardPage: ComponentType;

// Mock the shared components
vi.mock("@shared/components/Header1", () => ({
  default: ({
    onNotificationClick,
    onAboutClick,
    onServiceMenuClick,
  }: {
    onNotificationClick: () => void;
    onAboutClick: () => void;
    onServiceMenuClick: () => void;
  }) => (
    <header>
      <button onClick={onServiceMenuClick}>Menu</button>
      <button onClick={onNotificationClick}>Notifications</button>
      <button onClick={onAboutClick}>About</button>
    </header>
  ),
}));

vi.mock("@shared/components/BottomNavigation", () => ({
  default: () => <nav>Bottom Navigation</nav>,
}));

vi.mock("@shared/components/SideBar", () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div>
        Sidebar Content <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

// Mock the dashboard components
vi.mock("../components/BalanceCard", () => ({
  default: ({ viewBalance }: { viewBalance: () => void }) => (
    <div>
      <button onClick={viewBalance}>View Balance</button>
    </div>
  ),
}));

vi.mock("../components/TransactionsSection", () => ({
  default: ({ fetchTransactions }: { fetchTransactions: () => void }) => (
    <button onClick={fetchTransactions}>Load Transactions</button>
  ),
}));

vi.mock("@shared/components/ActionButtons", () => ({
  default: () => <div>Action Buttons</div>,
}));

describe("DashboardPage", () => {
  const navigateMock = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();

    // Setup mock account store with all required properties and methods
    mockUseAccountStore.mockReturnValue({
      accountId: "test-account-123",
      accountCert: "test-cert-456",
      status: "APPROVED",
      documentStatus: "APPROVED",
      kycCert: "test-kyc-cert",
      emailStatus: "APPROVED",
      phoneStatus: "APPROVED",
      onboardingCompleted: true,
      setAccountId: vi.fn(),
      setAccountCert: vi.fn(),
      setStatus: vi.fn(),
      setDocumentStatus: vi.fn(),
      setKycCert: vi.fn(),
      setEmailStatus: vi.fn(),
      setPhoneStatus: vi.fn(),
      setOnboardingCompleted: vi.fn(),
      clearAccount: vi.fn(),
    });

    // Setup mock navigation
    vi.mocked(useNavigate).mockReturnValue(navigateMock);

    // Setup mock API responses
    mockBalanceMutation.mutateAsync.mockResolvedValue({ balance: "1000.00" });
    mockTransactionsMutation.mutateAsync.mockResolvedValue({
      data: JSON.stringify([{ id: 1, amount: 100 }]),
    });

    // Mock toast
    vi.mocked(toast.error).mockImplementation(() => "");
    vi.mocked(toast.info).mockImplementation(() => "");

    // Re-import the component after setting up mocks
    const module = await import("../DashboardPage");
    DashboardPage = module.default;
  });

  it("renders the dashboard", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Bottom Navigation")).toBeInTheDocument();
  });

  it("handles menu toggle", () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByText("Menu"));
    expect(screen.getByText("Sidebar Content")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByText("Sidebar Content")).not.toBeInTheDocument();
  });

  it("handles notifications click", () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByText("Notifications"));
    expect(toast.info).toHaveBeenCalledWith(
      "Notifications feature coming soon!",
    );
  });

  it("handles about click", () => {
    render(<DashboardPage />);
    fireEvent.click(screen.getByText("About"));
    expect(navigateMock).toHaveBeenCalledWith({ to: "/about" });
  });

  it("loads balance when eye icon is clicked", async () => {
    render(<DashboardPage />);

    // Find and click the eye icon to show balance
    const eyeIcon = document.querySelector(".fa-eye");
    if (!eyeIcon) throw new Error("Eye icon not found");
    fireEvent.click(eyeIcon);

    await waitFor(() => {
      expect(mockBalanceMutation.mutateAsync).toHaveBeenCalled();
    });
  });

  it("loads transactions when fetchTransactions is called", async () => {
    // Mock transaction data that matches the expected format in TransactionsSection
    const mockTransactions = [
      {
        id: 1,
        amount: "100.00",
        type: "CREDIT",
        description: "Test Transaction",
        date: new Date().toISOString(),
      },
    ];

    mockTransactionsMutation.mutateAsync.mockResolvedValueOnce({
      data: JSON.stringify(mockTransactions),
    });

    render(<DashboardPage />);

    // Find and click the "View All" button to load transactions
    const viewAllButton = screen.getByText("View All");
    fireEvent.click(viewAllButton);

    // Verify transactions are loaded with the correct account ID
    await waitFor(() => {
      expect(mockTransactionsMutation.mutateAsync).toHaveBeenCalledWith(
        expect.objectContaining({
          requestBody: {
            accountID: "test-account-123",
          },
        }),
      );
    });
  });

  it("shows error when balance fetch fails", async () => {
    const errorMessage = "Failed to retrieve balance. Please try again.";
    mockBalanceMutation.mutateAsync.mockRejectedValueOnce(
      new Error("API Error"),
    );

    render(<DashboardPage />);

    // Find the eye icon button by its SVG icon class
    const eyeIcon = document.querySelector(".fa-eye");
    if (!eyeIcon) throw new Error("Eye icon not found");
    fireEvent.click(eyeIcon);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });
});
