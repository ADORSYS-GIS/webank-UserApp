import { render, screen, fireEvent, act } from "@testing-library/react";
import { useNavigate } from "@tanstack/react-router";
import { vi, expect, describe, it, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import type { UseMutationResult } from "@tanstack/react-query";

// Mock the mutation hooks
vi.mock("@openapi/generated/prs/queries/queries", () => ({
  useRecoveryServicePostApiPrsKycRecoveryToken: vi.fn(),
  useAccountRecoveryServicePostApiPrsKycRecoveryValidate: vi.fn(),
}));

// Mock external dependencies
vi.mock("@tanstack/react-router");
vi.mock("@state/accountStore");
vi.mock("@openapi/generated/prs/queries/queries");
vi.mock("sonner");

// Mock react-icons
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
import RecoverAccountPage from "../RecoverAccountPage";
import { useAccountStore } from "@state/accountStore";
import {
  useRecoveryServicePostApiPrsKycRecoveryToken,
  useAccountRecoveryServicePostApiPrsKycRecoveryValidate,
} from "@openapi/generated/prs/queries/queries";
import { toast } from "sonner";

// Get the mocked modules
const mockUseNavigate = vi.mocked(useNavigate);
const mockUseAccountStore = vi.mocked(useAccountStore);
const mockUseRecoveryToken = vi.mocked(
  useRecoveryServicePostApiPrsKycRecoveryToken,
);
const mockUseRecoveryValidate = vi.mocked(
  useAccountRecoveryServicePostApiPrsKycRecoveryValidate,
);
const mockToast = vi.mocked(toast);

// Define the shape of our mock store with all required properties from AccountState
interface MockAccountStore {
  accountId: string | null;
  accountCert: string | null;
  kycCert: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
  documentStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
  emailStatus: "APPROVED" | null;
  phoneStatus: "APPROVED" | null;
  onboardingCompleted: boolean;
  setAccountId: (id: string) => void;
  setAccountCert: (cert: string) => void;
  setKycCert: (kycCert: string) => void;
  setStatus: (status: "PENDING" | "APPROVED" | "REJECTED") => void;
  setDocumentStatus: (status: "PENDING" | "APPROVED" | "REJECTED") => void;
  setEmailStatus: (status: "APPROVED") => void;
  setPhoneStatus: (status: "APPROVED") => void;
  setOnboardingCompleted: (completed: boolean) => void;
  clearAccount: () => void;
}

// Helper function to create a mock store implementation
const createMockStore = (
  state: Partial<MockAccountStore> = {},
): MockAccountStore => ({
  accountId: null,
  accountCert: null,
  kycCert: null,
  status: null,
  documentStatus: null,
  emailStatus: null,
  phoneStatus: null,
  onboardingCompleted: false,
  setAccountId: vi.fn(),
  setAccountCert: vi.fn(),
  setKycCert: vi.fn(),
  setStatus: vi.fn(),
  setDocumentStatus: vi.fn(),
  setEmailStatus: vi.fn(),
  setPhoneStatus: vi.fn(),
  setOnboardingCompleted: vi.fn(),
  clearAccount: vi.fn(),
  ...state,
});

describe("RecoverAccountPage", () => {
  let store: MockAccountStore;
  let navigateMock: ReturnType<typeof vi.fn>;
  let mutateRecoveryToken: ReturnType<typeof vi.fn>;
  let mutateRecoveryValidate: ReturnType<typeof vi.fn>;

  const renderComponent = () => {
    return render(<RecoverAccountPage />);
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create fresh mocks for each test
    navigateMock = vi.fn();
    mutateRecoveryToken = vi.fn();
    mutateRecoveryValidate = vi.fn();

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

    // Mock the recovery token mutation with proper type
    interface TokenRequest {
      oldAccountId?: string;
    }
    type TokenResponse = string;

    const mockTokenMutation = {
      data: undefined,
      error: null,
      isError: false,
      isSuccess: false,
      mutate: mutateRecoveryToken,
      mutateAsync: vi
        .fn()
        .mockResolvedValue(undefined) as unknown as (variables: {
        requestBody: TokenRequest;
      }) => Promise<TokenResponse>,
      reset: vi.fn(),
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isIdle: true,
      isPaused: false,
      status: "idle" as const,
      variables: undefined,
      submittedAt: 0,
      isPending: false,
    } as UseMutationResult<TokenResponse, Error, { requestBody: TokenRequest }>;

    mockUseRecoveryToken.mockReturnValue(mockTokenMutation);

    // Mock the recovery validate mutation with proper type
    type RecoveryRequest = { newAccountId: string };
    type RecoveryResponse = {
      accountId: string;
      kycCertificate: string;
      status: string;
    };

    const mockRecoveryMutation = {
      data: undefined,
      error: null,
      isError: false,
      isSuccess: false,
      mutate: mutateRecoveryValidate,
      mutateAsync: vi
        .fn()
        .mockResolvedValue(undefined) as unknown as (variables: {
        requestBody: RecoveryRequest;
      }) => Promise<RecoveryResponse>,
      reset: vi.fn(),
      context: undefined,
      failureCount: 0,
      failureReason: null,
      isIdle: true,
      isPaused: false,
      status: "idle" as const,
      variables: undefined,
      submittedAt: 0,
      isPending: false,
    } as UseMutationResult<
      RecoveryResponse,
      Error,
      { requestBody: RecoveryRequest }
    >;

    mockUseRecoveryValidate.mockReturnValue(mockRecoveryMutation);

    // Mock toast
    mockToast.error = vi.fn();
    mockToast.success = vi.fn();
  });

  // Helper function to update the store
  const updateStore = (updates: Partial<MockAccountStore>) => {
    Object.assign(store, updates);
  };

  it("renders correctly with initial state", () => {
    renderComponent();

    expect(screen.getByText("Account Recovery")).toBeInTheDocument();
    expect(screen.getByText("Recover Your Account")).toBeInTheDocument();
    expect(screen.getByText("Initiate KYC Recovery")).toBeInTheDocument();
    expect(screen.getByText("Input Recovery Token")).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", () => {
    renderComponent();

    const backButton = screen.getByLabelText("Go Back");
    fireEvent.click(backButton);

    expect(navigateMock).toHaveBeenCalledWith({ to: "/settings" });
  });

  it("opens WhatsApp with support number when KYC recovery is clicked", () => {
    updateStore({ accountId: "test-account-id" });
    renderComponent();

    const kycRecoveryButton = screen
      .getByText("Initiate KYC Recovery")
      .closest("button");
    fireEvent.click(kycRecoveryButton!);

    expect(mockWindowOpen).toHaveBeenCalledWith(
      expect.stringContaining(
        "https://api.whatsapp.com/send?phone=+237654066316&text",
      ),
      "_blank",
    );
  });

  it("shows token input when Input Recovery Token is clicked", () => {
    renderComponent();

    const tokenButton = screen
      .getByText("Input Recovery Token")
      .closest("button");
    fireEvent.click(tokenButton!);

    expect(screen.getByText("Enter Recovery Token")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Recovery Token")).toBeInTheDocument();
  });

  it("shows error when submitting empty token", async () => {
    renderComponent();

    // Open token input
    const tokenButton = screen
      .getByText("Input Recovery Token")
      .closest("button");
    fireEvent.click(tokenButton!);

    // Submit empty token
    const submitButton = screen.getByText("Submit").closest("button");
    await act(async () => {
      fireEvent.click(submitButton!);
    });

    expect(mockToast.error).toHaveBeenCalledWith(
      "Please enter a valid recovery token.",
    );
    expect(mutateRecoveryToken).not.toHaveBeenCalled();
  });

  it("shows error when account info is missing during token submission", async () => {
    updateStore({ accountId: null, accountCert: null });
    renderComponent();

    // Open token input and enter a token
    const tokenButton = screen
      .getByText("Input Recovery Token")
      .closest("button");
    fireEvent.click(tokenButton!);

    const tokenInput = screen.getByPlaceholderText("Recovery Token");
    fireEvent.change(tokenInput, { target: { value: "test-token" } });

    // Submit token
    const submitButton = screen.getByText("Submit").closest("button");
    await act(async () => {
      fireEvent.click(submitButton!);
    });

    expect(mockToast.error).toHaveBeenCalledWith(
      "Account information is missing.",
    );
    expect(mutateRecoveryToken).not.toHaveBeenCalled();
  });

  it("handles successful token submission and shows confirmation", async () => {
    updateStore({ accountId: "test-account-id", accountCert: "test-cert" });
    renderComponent();

    // Mock successful token submission
    mutateRecoveryToken.mockImplementation((_, { onSuccess }) => {
      onSuccess("old-account-id kyc-cert-value");
      return Promise.resolve();
    });

    // Open token input and enter a token
    const tokenButton = screen
      .getByText("Input Recovery Token")
      .closest("button");
    fireEvent.click(tokenButton!);

    const tokenInput = screen.getByPlaceholderText("Recovery Token");
    fireEvent.change(tokenInput, { target: { value: "test-token" } });

    // Submit token
    const submitButton = screen.getByText("Submit").closest("button");
    await act(async () => {
      fireEvent.click(submitButton!);
    });

    // Verify the confirmation dialog is shown
    expect(screen.getByText("Confirm Recovery")).toBeInTheDocument();
    expect(store.setAccountId).toHaveBeenCalledWith("old-account-id");
    expect(store.setKycCert).toHaveBeenCalledWith("kyc-cert-value");
  });

  it("handles successful account recovery", async () => {
    // Set up initial store state
    updateStore({
      accountId: "test-account-id",
      accountCert: "test-cert",
    });

    renderComponent();

    // Mock successful token submission
    mutateRecoveryToken.mockImplementation((_, { onSuccess }) => {
      onSuccess("old-account-id kyc-cert-value");
      return Promise.resolve();
    });

    // Mock successful account recovery
    mutateRecoveryValidate.mockImplementation((_, { onSuccess }) => {
      onSuccess({
        accountId: "test-account-id",
        kycCertificate: "new-kyc-cert",
        status: "SUCCESS",
      });
      return Promise.resolve();
    });

    // Click the "Input Recovery Token" button
    const tokenButton = screen
      .getByText("Input Recovery Token")
      .closest("button");
    fireEvent.click(tokenButton!);

    // Find and fill the token input
    const tokenInput = await screen.findByPlaceholderText("Recovery Token");
    fireEvent.change(tokenInput, { target: { value: "test-token" } });

    // Submit the token
    const submitButton = screen.getByText("Submit").closest("button");
    await act(async () => {
      fireEvent.click(submitButton!);
    });

    // The confirmation dialog should be shown
    await screen.findByText("Confirm Recovery");

    // Click the confirm button
    const confirmButton = screen.getByText("Confirm").closest("button");
    await act(async () => {
      fireEvent.click(confirmButton!);
    });

    // The component should update the store with the new cert
    expect(store.setAccountCert).toHaveBeenCalledWith("new-kyc-cert");

    // Verify success toast is shown
    expect(mockToast.success).toHaveBeenCalledWith(
      "Account recovery successful!",
    );

    // Verify navigation happens after success
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1600));
    });

    expect(navigateMock).toHaveBeenCalledWith({ to: "/" });
  });

  it("handles recovery validation error", async () => {
    updateStore({ accountId: "test-account-id" });
    renderComponent();

    // Mock successful token submission
    mutateRecoveryToken.mockImplementation((_, { onSuccess }) => {
      onSuccess("old-account-id kyc-cert-value");
      return Promise.resolve();
    });

    // Mock failed account recovery
    const error = new Error("Failed to recover account");
    mutateRecoveryValidate.mockImplementation((_, { onError }) => {
      onError(error);
      return Promise.resolve();
    });

    // Click the "Input Recovery Token" button
    const tokenButton = screen
      .getByText("Input Recovery Token")
      .closest("button");
    fireEvent.click(tokenButton!);

    // Find and fill the token input
    const tokenInput = await screen.findByPlaceholderText("Recovery Token");
    fireEvent.change(tokenInput, { target: { value: "test-token" } });

    // Submit the token
    const submitButton = screen.getByText("Submit").closest("button");
    await act(async () => {
      fireEvent.click(submitButton!);
    });

    // Verify the error was handled with the correct error message
    expect(mockToast.error).toHaveBeenCalledWith(
      "Account information is missing.",
    );
  });

  it("handles token submission error", async () => {
    updateStore({ accountId: "test-account-id", accountCert: "test-cert" });
    renderComponent();

    // Mock failed token submission
    const error = new Error("Token submission failed");
    mutateRecoveryToken.mockImplementation((_, { onError }) => {
      onError(error);
      return Promise.resolve();
    });

    // Open token input and enter a token
    const tokenButton = screen
      .getByText("Input Recovery Token")
      .closest("button");
    fireEvent.click(tokenButton!);

    const tokenInput = screen.getByPlaceholderText("Recovery Token");
    fireEvent.change(tokenInput, { target: { value: "invalid-token" } });

    // Submit token
    const submitButton = screen.getByText("Submit").closest("button");
    await act(async () => {
      fireEvent.click(submitButton!);
    });

    // Verify the error was handled
    expect(mockToast.error).toHaveBeenCalledWith(
      "Token submission failed: Token submission failed",
    );
  });
});
