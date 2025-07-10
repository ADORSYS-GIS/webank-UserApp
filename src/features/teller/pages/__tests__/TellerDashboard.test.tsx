import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import {
  QueryClient,
  QueryClientProvider,
  QueryObserverResult,
} from "@tanstack/react-query";
import { vi, expect } from "vitest";
import "@testing-library/jest-dom";

// Mock the modules first
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@state/accountStore", () => ({
  useAccountStore: vi.fn(),
}));

vi.mock("@openapi/generated/prs/queries/queries", () => ({
  useOtpRetrievalServiceGetApiPrsOtpPending: vi.fn(),
}));

// Import the mocks after setting them up
import { toast } from "sonner";
import { useAccountStore } from "@state/accountStore";
import { useOtpRetrievalServiceGetApiPrsOtpPending } from "@openapi/generated/prs/queries/queries";
import TellerDashboard from "../TellerPage";

// Create a mock implementation for the toast
const mockToast = {
  error: vi.fn(),
  success: vi.fn(),
};

// Override the toast implementation
Object.assign(toast, mockToast);

// Get the mocked modules
const mockUseAccountStore = vi.mocked(useAccountStore);
const mockUseOtpRetrieval = vi.mocked(
  useOtpRetrievalServiceGetApiPrsOtpPending,
);

// Helper function to create a mock query result
const createMockQueryResult = <T,>(
  data: T,
  options: Partial<QueryObserverResult<T, Error>> = {},
): QueryObserverResult<T, Error> =>
  ({
    data,
    error: null,
    isError: false,
    isSuccess: true,
    status: "success",
    isLoading: false,
    isFetching: false,
    refetch: vi.fn(),
    fetchStatus: "idle",
    isStale: false,
    isFetched: true,
    isFetchedAfterMount: true,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    isInitialLoading: false,
    isLoadingError: false,
    isPlaceholderData: false,
    isPaused: false,
    isRefetchError: false,
    isRefetching: false,
    dataUpdatedAt: Date.now(),
    ...options,
  }) as unknown as QueryObserverResult<T, Error>;

describe("TellerDashboard", () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const mockData = [
    { phoneNumber: "+1234567890", otpCode: "123456", status: "Pending" },
    { phoneNumber: "+1987654321", otpCode: "654321", status: "Sent" },
  ];

  const defaultAccountStore = {
    accountCert: "test-cert",
    account: {
      id: "test-account-id",
      email: "test@example.com",
      phoneNumber: "+1234567890",
    },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    setAccount: vi.fn(),
    setAccountCert: vi.fn(),
    clear: vi.fn(),
  };

  const renderComponent = async (
    customData = mockData,
    accountStoreOverrides = {},
  ) => {
    // Set up mock account store with overrides if provided
    mockUseAccountStore.mockReturnValue({
      ...defaultAccountStore,
      ...accountStoreOverrides,
    });

    // Set up mock API response
    mockUseOtpRetrieval.mockReturnValue(createMockQueryResult(customData));

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <TellerDashboard />
        </QueryClientProvider>,
      );
    });
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Reset toast mocks
    mockToast.error.mockClear();
    mockToast.success.mockClear();
  });

  it("renders loading state initially", async () => {
    // Set up loading state
    mockUseOtpRetrieval.mockReturnValue(
      createMockQueryResult([], {
        isLoading: true,
        isFetching: true,
        status: "pending",
        fetchStatus: "fetching",
      }),
    );

    // Make sure account store is mocked
    mockUseAccountStore.mockReturnValue({
      ...defaultAccountStore,
    });

    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <TellerDashboard />
        </QueryClientProvider>,
      );
    });

    // Check if loading state is shown
    expect(screen.getByText("Loading otpCode requests...")).toBeInTheDocument();
  });

  it("renders OTP requests when data is loaded", async () => {
    await renderComponent();

    // Check if the data is displayed
    expect(screen.getByText(/\+1234567890/)).toBeInTheDocument();
    expect(screen.getByText(/123456/)).toBeInTheDocument();
    expect(screen.getByText(/Pending/)).toBeInTheDocument();

    expect(screen.getByText(/\+1987654321/)).toBeInTheDocument();
    expect(screen.getByText(/654321/)).toBeInTheDocument();
    expect(screen.getByText(/Sent/)).toBeInTheDocument();
  });

  it("shows error message when API fails", async () => {
    // Create a mock error
    const error = new Error("API Error");

    // Set up the mock to return an error
    mockUseOtpRetrieval.mockReturnValue(
      createMockQueryResult([], {
        error,
        isError: true,
        isSuccess: false,
        status: "error",
        isLoading: false,
        isFetching: false,
        failureCount: 1,
        failureReason: error,
        errorUpdateCount: 1,
        isLoadingError: true,
        isRefetchError: false,
      }),
    );

    // Make sure account store is mocked
    mockUseAccountStore.mockReturnValue({
      ...defaultAccountStore,
      accountCert: "test-cert", // Make sure accountCert is set
    });

    // Render the component
    await act(async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <TellerDashboard />
        </QueryClientProvider>,
      );
    });

    // Wait for the error toast to be called
    await waitFor(
      () => {
        expect(mockToast.error).toHaveBeenCalledWith(
          expect.stringContaining("Failed to retrieve otpCode requests"),
        );
      },
      { timeout: 3000 },
    );
  });

  it("opens WhatsApp with correct phone number and OTP", async () => {
    await renderComponent();

    // Mock window.open
    const mockOpen = vi.fn();
    window.open = mockOpen;

    // Find and click the first WhatsApp button
    const whatsappButtons = screen.getAllByRole("button", {
      name: /whatsapp/i,
    });
    fireEvent.click(whatsappButtons[0]);

    // Check if window.open was called with the correct URL
    expect(mockOpen).toHaveBeenCalledWith(
      "https://api.whatsapp.com/send?phone=+1234567890&text=Your%20otpCode%20is%20123456",
      "_blank",
    );
  });
});
