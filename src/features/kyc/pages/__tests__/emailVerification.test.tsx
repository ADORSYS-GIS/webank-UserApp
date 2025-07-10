import { render, screen, fireEvent, act } from "@testing-library/react";
import { useNavigate } from "@tanstack/react-router";
import { vi, expect, describe, it, beforeEach } from "vitest";
import "@testing-library/jest-dom";

// Mock external dependencies first
vi.mock("@tanstack/react-router");
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));
vi.mock("@state/accountStore");
vi.mock("@openapi/generated/prs/queries/queries");
vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({
    icon,
    className,
  }: {
    icon: { iconName: string };
    className: string;
  }) => <div data-testid={`icon-${icon.iconName}`} className={className} />,
}));

// Import the component after setting up mocks
import EmailVerification from "../emailVerification";
import { useAccountStore } from "@state/accountStore";
import { useEmailOtpServicePostApiPrsEmailOtpSend } from "@openapi/generated/prs/queries/queries";
import { toast } from "sonner";

// Get the mocked modules
const mockUseNavigate = vi.mocked(useNavigate);
const mockUseAccountStore = vi.mocked(useAccountStore);
const mockUseEmailOtp = vi.mocked(useEmailOtpServicePostApiPrsEmailOtpSend);

// Mock the toast module
const mockToast = {
  error: vi.fn(),
  success: vi.fn(),
};

// Set up toast mocks
vi.mocked(toast).error = mockToast.error;
vi.mocked(toast).success = mockToast.success;

// Define the shape of our mock store
interface MockAccountStore {
  // State properties
  accountId: string | null;
  accountCert: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | null;
  documentStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
  kycCert: string | null;
  emailStatus: "APPROVED" | null;
  phoneStatus: "APPROVED" | null;
  onboardingCompleted: boolean;

  // Action methods
  setAccountId: (id: string) => void;
  setAccountCert: (cert: string) => void;
  setStatus: (status: "PENDING" | "APPROVED" | "REJECTED") => void;
  setDocumentStatus: (status: "PENDING" | "APPROVED" | "REJECTED") => void;
  setKycCert: (cert: string | null) => void;
  setEmailStatus: (status: "APPROVED" | null) => void;
  setPhoneStatus: (status: "APPROVED" | null) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  clearAccount: () => void;
}

// Helper function to create a mock store implementation
const createMockStore = (
  state: Partial<MockAccountStore> = {},
): MockAccountStore => ({
  // Default state
  accountId: "test-account-id",
  accountCert: "test-cert",
  status: "PENDING",
  documentStatus: "PENDING",
  kycCert: null,
  emailStatus: null,
  phoneStatus: null,
  onboardingCompleted: false,

  // Default mock actions
  setAccountId: vi.fn(),
  setAccountCert: vi.fn(),
  setStatus: vi.fn(),
  setDocumentStatus: vi.fn(),
  setKycCert: vi.fn(),
  setEmailStatus: vi.fn(),
  setPhoneStatus: vi.fn(),
  setOnboardingCompleted: vi.fn(),
  clearAccount: vi.fn(),

  // Override with provided state
  ...state,
});

// Create a mock mutation result
const createMockMutation = (overrides = {}) => ({
  mutateAsync: vi.fn(),
  isPending: false,
  isError: false,
  isSuccess: false,
  data: undefined,
  error: null,
  variables: undefined,
  submittedAt: 0,
  mutate: vi.fn(),
  reset: vi.fn(),
  status: "idle",
  context: undefined,
  isIdle: true,
  isPaused: false,
  failureCount: 0,
  failureReason: null,
  isLoading: false,
  isFetched: false,
  isFetchedAfterMount: false,
  isFetching: false,
  isInitialLoading: false,
  isPlaceholderData: false,
  isPreviousData: false,
  isRefetchError: false,
  isRefetching: false,
  isLoadingError: false,
  dataUpdatedAt: 0,
  errorUpdateCount: 0,
  errorUpdatedAt: 0,
  fetchStatus: "idle",
  remove: vi.fn(),
  ...overrides,
});

describe("EmailVerification", () => {
  let store: MockAccountStore;
  let navigateMock: ReturnType<typeof vi.fn>;
  let mutateAsyncMock: ReturnType<typeof vi.fn>;
  let mutation: ReturnType<typeof createMockMutation>;

  const renderComponent = () => {
    return render(<EmailVerification />);
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Create fresh mocks for each test
    navigateMock = vi.fn();
    mutateAsyncMock = vi.fn();

    // Set up the store with default values
    store = createMockStore();

    // Set up the mutation with the mock function
    mutation = createMockMutation({
      mutateAsync: mutateAsyncMock,
    });

    // Set up the mocks
    mockUseNavigate.mockReturnValue(navigateMock);
    mockUseAccountStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(store);
      }
      return store;
    });
    mockUseEmailOtp.mockReturnValue(
      mutation as unknown as ReturnType<
        typeof useEmailOtpServicePostApiPrsEmailOtpSend
      >,
    );

    // Mock toast implementation
    vi.mocked(toast.error).mockImplementation(vi.fn());
    vi.mocked(toast.success).mockImplementation(vi.fn());
  });

  // Helper function to update the store
  const updateStore = (updates: Partial<MockAccountStore>) => {
    Object.assign(store, updates);
  };

  it("renders correctly with initial state", () => {
    renderComponent();

    expect(screen.getByText("Secure Your Account")).toBeInTheDocument();
    expect(
      screen.getByText(
        "We'll send a 6-digit verification code to your email address to ensure your account security.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Verification Code" }),
    ).toBeInTheDocument();
  });

  it("navigates back when back button is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /go back/i }));
    expect(navigateMock).toHaveBeenCalledWith({ to: "/settings" });
  });

  it("shows error for invalid email format", async () => {
    renderComponent();

    const emailInput = screen.getByPlaceholderText("name@example.com");
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(
      screen.getByRole("button", { name: "Send Verification Code" }),
    );

    expect(mockToast.error).toHaveBeenCalledWith(
      "Please enter a valid email address.",
    );
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("handles missing account info", async () => {
    // Setup mock to simulate missing account info
    updateStore({
      accountId: null,
      accountCert: null,
    });

    renderComponent();

    const emailInput = screen.getByPlaceholderText("name@example.com");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(
      screen.getByRole("button", { name: "Send Verification Code" }),
    );

    expect(mockToast.error).toHaveBeenCalledWith(
      "Account information is missing.",
    );
    expect(mutateAsyncMock).not.toHaveBeenCalled();
  });

  it("sends OTP code on valid email submission", async () => {
    renderComponent();

    const testEmail = "test@example.com";
    const emailInput = screen.getByPlaceholderText("name@example.com");

    fireEvent.change(emailInput, { target: { value: testEmail } });
    fireEvent.click(
      screen.getByRole("button", { name: "Send Verification Code" }),
    );

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      requestBody: {
        email: testEmail,
        accountId: store.accountId!,
      },
    });
  });

  it("handles successful OTP submission", async () => {
    // Mock successful OTP submission
    const testEmail = "test@example.com";
    mutateAsyncMock.mockResolvedValueOnce({ status: true });

    // First render the component
    renderComponent();

    // Wait for the component to be fully rendered
    const emailInput = await screen.findByPlaceholderText("name@example.com");

    // Interact with the component
    fireEvent.change(emailInput, { target: { value: testEmail } });

    // Click the button and wait for the async operation to complete
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Send Verification Code" }),
      );
    });

    // Verify the expected outcomes
    expect(mockToast.success).toHaveBeenCalledWith(
      "OTP sent, please check your email.",
      { duration: 5000 },
    );
    expect(navigateMock).toHaveBeenCalledWith({
      to: "/emailCode",
      state: { email: testEmail, accountCert: store.accountCert },
    });
  });

  it("handles OTP submission error", async () => {
    // Mock a failed mutation
    const errorMessage = "Failed to send OTP";
    mutateAsyncMock.mockRejectedValueOnce(new Error(errorMessage));

    renderComponent();

    const testEmail = "test@example.com";
    const emailInput = screen.getByPlaceholderText("name@example.com");

    fireEvent.change(emailInput, { target: { value: testEmail } });
    await act(async () => {
      fireEvent.click(
        screen.getByRole("button", { name: "Send Verification Code" }),
      );
    });

    expect(mockToast.error).toHaveBeenCalledWith(
      "An unexpected error occurred.",
    );
  });
});
