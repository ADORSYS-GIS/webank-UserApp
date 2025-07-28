import { render, screen, fireEvent } from "@testing-library/react";
import { useNavigate } from "@tanstack/react-router";
import { vi, expect, describe, it, beforeEach } from "vitest";
import "@testing-library/jest-dom";

// Mock external dependencies
vi.mock("@tanstack/react-router");
vi.mock("@state/accountStore");

// Mock window.open
const mockWindowOpen = vi.fn();
window.open = mockWindowOpen;

// Import component after mocks
import SettingsPage from "../SettingsPage";
import { useAccountStore } from "@state/accountStore";
import type { AccountState } from "@state/accountStore";

// Get mocked hooks
const mockUseNavigate = vi.mocked(useNavigate);
const mockUseAccountStore = vi.mocked(useAccountStore);

// Mock store factory
type MockAccountStore = AccountState & {
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
};

const createMockStore = (
  initialState: Partial<AccountState> = {},
): MockAccountStore => ({
  accountId: null,
  accountCert: null,
  status: null,
  documentStatus: null,
  kycCert: null,
  emailStatus: null,
  phoneStatus: null,
  onboardingCompleted: false,
  ...initialState,
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

describe("SettingsPage", () => {
  let store: MockAccountStore;
  let navigateMock: ReturnType<typeof vi.fn>;

  const renderComponent = () => render(<SettingsPage />);

  const updateStore = (updates: Partial<AccountState>) => {
    Object.assign(store, updates);
    mockUseAccountStore.mockImplementation((selector) =>
      typeof selector === "function" ? selector(store) : (store as never),
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    navigateMock = vi.fn();
    store = createMockStore();
    mockUseNavigate.mockReturnValue(navigateMock);
    mockUseAccountStore.mockImplementation((selector) =>
      typeof selector === "function" ? selector(store) : (store as never),
    );
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
  });

  it("navigates back when back button is clicked", () => {
    renderComponent();
    const backButton = screen.getByLabelText("Go back");
    fireEvent.click(backButton);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
  });

  it("shows verified status when email and phone are approved", () => {
    updateStore({ emailStatus: "APPROVED", phoneStatus: "APPROVED" });
    renderComponent();

    expect(screen.getByText("Email Verified")).toBeInTheDocument();
    expect(screen.getByText("Phone Number Verified")).toBeInTheDocument();

    const emailBtn = screen.getByText("Email verification").closest("button");
    const phoneBtn = screen
      .getByText("Phone number verification")
      .closest("button");

    expect(emailBtn).toBeDisabled();
    expect(phoneBtn).toBeDisabled();
  });

  it("navigates to email verification", () => {
    renderComponent();
    const btn = screen.getByText("Email verification").closest("button");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn!);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/inputEmail" });
  });

  it("navigates to phone verification", () => {
    renderComponent();
    const btn = screen.getByText("Phone number verification").closest("button");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn!);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/phone" });
  });

  it("navigates to account recovery", () => {
    renderComponent();
    const btn = screen.getByText("Recover your account").closest("button");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn!);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/recoverAccount" });
  });

  it("opens WhatsApp for support", () => {
    renderComponent();
    const btn = screen.getByText("Help & Support").closest("button");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn!);
    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining("https://api.whatsapp.com/send?phone="),
      "_blank",
    );
  });

  it("navigates to KYC page", () => {
    renderComponent();
    const btn = screen.getByText("Secure your account").closest("button");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn!);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/kyc" });
  });

  it("matches snapshot", () => {
    const { container } = renderComponent();
    expect(container).toMatchSnapshot();
  });
});
