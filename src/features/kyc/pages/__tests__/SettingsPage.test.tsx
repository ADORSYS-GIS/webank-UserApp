import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "@tanstack/react-router";
import { vi, expect, describe, it, beforeEach } from "vitest";
import "@testing-library/jest-dom";

// Mock external dependencies
vi.mock("@tanstack/react-router");
vi.mock("@state/accountStore");

// Mock react-icons
vi.mock("react-icons/fa", () => ({
  FaArrowLeft: () => <div data-testid="fa-arrow-left" />,
  FaUser: () => <div data-testid="fa-user" />,
}));

// Mock fontawesome icons
vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({
    icon,
    className,
    size,
  }: {
    icon: { iconName?: string };
    className?: string;
    size?: string;
  }) => (
    <div
      data-testid={`fa-icon-${icon.iconName || "unknown"}`}
      className={className}
      data-size={size}
    />
  ),
}));

// Mock the window.open function
const mockWindowOpen = vi.fn();
window.open = mockWindowOpen;

// Import the component after setting up mocks
import SettingsPage from "../SettingsPage";
import { useAccountStore } from "@state/accountStore";
import type { AccountState } from "@state/accountStore";

// Define the AccountActions interface since it's not exported
interface AccountActions {
  setAccountId: (accountId: string) => void;
  setAccountCert: (accountCert: string) => void;
  setStatus: (status: "PENDING" | "APPROVED" | "REJECTED") => void;
  setDocumentStatus: (
    documentStatus: "PENDING" | "APPROVED" | "REJECTED",
  ) => void;
  setKycCert: (kycCert: string) => void;
  setEmailStatus: (emailStatus: "APPROVED") => void;
  setPhoneStatus: (phoneStatus: "APPROVED") => void;
  setOnboardingCompleted: (completed: boolean) => void;
  clearAccount: () => void;
}

// Get the mocked modules
const mockUseNavigate = vi.mocked(useNavigate);
const mockUseAccountStore = vi.mocked(useAccountStore);

// Create a mock implementation of the account store
type MockAccountStore = AccountState & AccountActions;

const createMockStore = (
  initialState: Partial<AccountState> = {},
): MockAccountStore => {
  // Default state values
  const defaultState: AccountState = {
    accountId: null,
    accountCert: null,
    status: null,
    documentStatus: null,
    kycCert: null,
    emailStatus: null,
    phoneStatus: null,
    onboardingCompleted: false,
  };

  // Create the mock store with state and actions
  const store: MockAccountStore = {
    // Spread the default state
    ...defaultState,
    // Override with any provided initial state
    ...initialState,
    // Mock actions
    setAccountId: vi.fn(),
    setAccountCert: vi.fn(),
    setStatus: vi.fn(),
    setDocumentStatus: vi.fn(),
    setKycCert: vi.fn(),
    setEmailStatus: vi.fn(),
    setPhoneStatus: vi.fn(),
    setOnboardingCompleted: vi.fn(),
    clearAccount: vi.fn(),
  };

  return store;
};

describe("SettingsPage", () => {
  let store: MockAccountStore;
  let navigateMock: ReturnType<typeof vi.fn>;

  const renderComponent = () => {
    return render(<SettingsPage />);
  };

  // Helper to update the store state
  const updateStore = (updates: Partial<AccountState>) => {
    Object.assign(store, updates);
    // Force a re-render by updating the mock implementation
    mockUseAccountStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(store);
      }
      return store as never;
    });
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create fresh mocks for each test
    navigateMock = vi.fn();

    // Set up the store with default values
    store = createMockStore();

    // Set up the mocks
    mockUseNavigate.mockReturnValue(navigateMock);
    mockUseAccountStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(store);
      }
      return store as never;
    });
  });

  it("renders correctly with initial state", () => {
    renderComponent();

    expect(screen.getByText("Settings")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your account preferences"),
    ).toBeInTheDocument();
    expect(screen.getByText("Your Account")).toBeInTheDocument();
    expect(screen.getByText("Email Not Verified")).toBeInTheDocument();
    expect(screen.getByText("Phone Number Not Verified")).toBeInTheDocument();

    // Check menu items
    expect(screen.getByText("Secure your account")).toBeInTheDocument();
    expect(screen.getByText("Email verification")).toBeInTheDocument();
    expect(screen.getByText("Phone number verification")).toBeInTheDocument();
    expect(screen.getByText("Recover your account")).toBeInTheDocument();
    expect(screen.getByText("Help & Support")).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", () => {
    renderComponent();

    const backButton = screen.getByLabelText("Go back");
    fireEvent.click(backButton);

    expect(navigateMock).toHaveBeenCalledWith({ to: "/dashboard" });
  });

  it("shows verified status for email and phone when they are approved", () => {
    updateStore({
      emailStatus: "APPROVED",
      phoneStatus: "APPROVED",
    });

    renderComponent();

    expect(screen.getByText("Email Verified")).toBeInTheDocument();
    expect(screen.getByText("Phone Number Verified")).toBeInTheDocument();

    // Check that the disabled state is applied to verified items
    const emailVerificationButton = screen
      .getByText("Email verification")
      .closest("button");
    const phoneVerificationButton = screen
      .getByText("Phone number verification")
      .closest("button");

    expect(emailVerificationButton).toBeDisabled();
    expect(phoneVerificationButton).toBeDisabled();
  });

  it("navigates to email verification when email verification is clicked", () => {
    renderComponent();

    const emailVerificationButton = screen
      .getByText("Email verification")
      .closest("button");
    fireEvent.click(emailVerificationButton!);

    expect(navigateMock).toHaveBeenCalledWith({ to: "/inputEmail" });
  });

  it("navigates to phone verification when phone verification is clicked", () => {
    renderComponent();

    const phoneVerificationButton = screen
      .getByText("Phone number verification")
      .closest("button");
    fireEvent.click(phoneVerificationButton!);

    expect(navigateMock).toHaveBeenCalledWith({ to: "/phone" });
  });

  it("navigates to account recovery when recover account is clicked", () => {
    renderComponent();

    const recoverAccountButton = screen
      .getByText("Recover your account")
      .closest("button");
    fireEvent.click(recoverAccountButton!);

    expect(navigateMock).toHaveBeenCalledWith({ to: "/recoverAccount" });
  });

  it("opens support chat when help & support is clicked", () => {
    renderComponent();

    const supportButton = screen.getByText("Help & Support").closest("button");
    fireEvent.click(supportButton!);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://api.whatsapp.com/send?phone=+237674388690&text=",
      ),
      "_blank",
    );
  });

  it("navigates to KYC when secure account is clicked", () => {
    renderComponent();

    const secureAccountButton = screen
      .getByText("Secure your account")
      .closest("button");
    fireEvent.click(secureAccountButton!);

    expect(navigateMock).toHaveBeenCalledWith({ to: "/kyc" });
  });
});
