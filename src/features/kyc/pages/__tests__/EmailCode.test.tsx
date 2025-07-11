import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import {
  useNavigate,
  useRouterState,
  RouterState,
} from "@tanstack/react-router";
import type { AnyRouter } from "@tanstack/router-core";
import { toast } from "sonner";
import { useAccountStore } from "@state/accountStore";
import EmailCode from "../emailCode";
import {
  useEmailOtpServicePostApiPrsEmailOtpSend,
  useEmailOtpServicePostApiPrsEmailOtpValidate,
} from "@openapi/generated/prs/queries/queries";

// Mock external dependencies
vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
  useRouterState: vi.fn(),
}));

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
  useEmailOtpServicePostApiPrsEmailOtpSend: vi.fn(),
  useEmailOtpServicePostApiPrsEmailOtpValidate: vi.fn(),
}));

describe("EmailCode", () => {
  const mockNavigate = vi.fn();
  const mockResendOtp = vi.fn();
  const mockVerifyOtp = vi.fn();
  const mockSetEmailStatus = vi.fn();

  const mockAccountStore = {
    accountId: "test-account-id",
    setEmailStatus: mockSetEmailStatus,
  } as const;

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mocks
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);

    // Mock router state with minimal required properties
    const mockRouterState = {
      location: {
        state: { email: "test@example.com", accountCert: "test-cert" },
        href: "",
        pathname: "/email-code",
        search: "",
        searchParams: new URLSearchParams(),
        hash: "",
        key: "test-key",
        toJSON: () => ({}),
      },
      matches: [],
      status: "idle" as const,
      isError: false,
    };

    // Properly type the mock router state
    vi.mocked(useRouterState).mockReturnValue({
      location: {
        ...mockRouterState.location,
        state: {
          email: "test@example.com",
          accountCert: "test-cert",
        },
        href: "http://localhost",
        pathname: "/test",
        search: "",
        searchParams: new URLSearchParams(),
        hash: "",
        key: "test",
        toJSON: () => ({}),
      },
      matches: [],
      status: "idle" as const,
      isError: false,
    } as unknown as RouterState<AnyRouter["routeTree"]>);
    vi.mocked(useAccountStore).mockReturnValue(mockAccountStore);

    // Mock the mutation hooks with proper types
    vi.mocked(useEmailOtpServicePostApiPrsEmailOtpSend).mockReturnValue({
      mutateAsync: mockResendOtp,
      mutate: vi.fn(),
      reset: vi.fn(),
      context: undefined,
      data: undefined,
      error: null,
      failureCount: 0,
      isPaused: false,
      isPending: false,
      isError: false,
      isIdle: true,
      isSuccess: false,
      status: "idle",
      variables: undefined,
      submittedAt: 0,
      failureReason: null,
      isStale: false,
      isStalePoller: false,
      isPendingError: false,
      isPlaceholderData: false,
      isLoading: false,
      isRefetching: false,
      isRefetchError: false,
      isLoadingError: false,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPreviousData: false,
      isSuccessAndThen: false,
      isErrorAndThen: false,
      isSettled: true,
    } as unknown as ReturnType<
      typeof useEmailOtpServicePostApiPrsEmailOtpSend
    >);

    vi.mocked(useEmailOtpServicePostApiPrsEmailOtpValidate).mockReturnValue({
      mutateAsync: mockVerifyOtp,
      mutate: vi.fn(),
      reset: vi.fn(),
      context: undefined,
      data: undefined,
      error: null,
      failureCount: 0,
      isPaused: false,
      isPending: false,
      isError: false,
      isIdle: true,
      isSuccess: false,
      status: "idle",
      variables: undefined,
      submittedAt: 0,
      failureReason: null,
      isStale: false,
      isStalePoller: false,
      isPendingError: false,
      isPlaceholderData: false,
      isLoading: false,
      isRefetching: false,
      isRefetchError: false,
      isLoadingError: false,
      isFetched: false,
      isFetchedAfterMount: false,
      isFetching: false,
      isInitialLoading: false,
      isPreviousData: false,
      isSuccessAndThen: false,
      isErrorAndThen: false,
      isSettled: true,
    } as unknown as ReturnType<
      typeof useEmailOtpServicePostApiPrsEmailOtpValidate
    >);

    // Reset toast mocks
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.success).mockClear();
  });

  it("renders all UI elements correctly", () => {
    render(<EmailCode />);

    // Check for main heading and text
    expect(screen.getByText(/verify your email/i)).toBeTruthy();
    expect(
      screen.getByText(/enter the 6-digit code sent to your email/i),
    ).toBeTruthy();
    expect(screen.getByText(/didn't receive the code\?/i)).toBeTruthy();

    // Check for buttons using more specific queries
    const resendButton = screen.getByRole("button", { name: /resend code/i });
    const backButton = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.trim() === "Back");
    const verifyButton = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent?.trim() === "Verify");

    expect(resendButton).toBeTruthy();
    expect(backButton).toBeTruthy();
    expect(verifyButton).toBeTruthy();
  });

  it("shows error for invalid OTP format", async () => {
    render(<EmailCode />);

    // Enter invalid OTP (just one digit)
    const otpInputs = document.querySelectorAll(
      'input[type="text"][inputmode="numeric"]',
    );
    fireEvent.change(otpInputs[0], { target: { value: "1" } });

    // Find the verify button by text and click it
    const buttons = screen.getAllByRole("button");
    const verifyButton = buttons.find((btn) =>
      btn.textContent?.includes("Verify"),
    );

    if (!verifyButton) throw new Error("Verify button not found");
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please enter a valid 6-digit OTP.",
      );
      expect(mockVerifyOtp).not.toHaveBeenCalled();
    });
  });

  it("handles OTP resend successfully", async () => {
    mockResendOtp.mockResolvedValueOnce({ status: "PENDING" });

    render(<EmailCode />);

    // Find the resend button by text and click it
    const buttons = screen.getAllByRole("button");
    const resendButton = buttons.find((btn) =>
      btn.textContent?.includes("Resend Code"),
    );

    if (!resendButton) throw new Error("Resend button not found");
    fireEvent.click(resendButton);

    await waitFor(() => {
      expect(mockResendOtp).toHaveBeenCalledWith({
        requestBody: {
          email: "test@example.com",
          accountId: "test-account-id",
        },
      });

      expect(toast.success).toHaveBeenCalledWith(
        "OTP Resend, please check your email.",
        { duration: 5000 },
      );
    });
  });

  it("handles OTP verification success", async () => {
    mockVerifyOtp.mockResolvedValueOnce({ status: "SUCCESS" });

    render(<EmailCode />);

    // Enter valid OTP
    const otpInputs = document.querySelectorAll(
      'input[type="text"][inputmode="numeric"]',
    );
    otpInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });

    // Find the verify button by text and click it
    const verifyButtons = screen.getAllByRole("button");
    const verifyButton = Array.from(verifyButtons).find((btn) =>
      btn.textContent?.includes("Verify"),
    );

    if (!verifyButton) throw new Error("Verify button not found");
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(mockVerifyOtp).toHaveBeenCalledWith({
        requestBody: {
          email: "test@example.com",
          accountId: "test-account-id",
          otpInput: "123456",
        },
      });

      expect(mockSetEmailStatus).toHaveBeenCalledWith("APPROVED");
    });
  });

  it("handles OTP verification failure", async () => {
    const errorResponse = { status: "FAILED", message: "OTP expired" };
    mockVerifyOtp.mockRejectedValueOnce(errorResponse);

    render(<EmailCode />);

    // Enter valid OTP
    const otpInputs = document.querySelectorAll(
      'input[type="text"][inputmode="numeric"]',
    );
    otpInputs.forEach((input, index) => {
      fireEvent.change(input, { target: { value: (index + 1).toString() } });
    });

    // Find the verify button by text and click it
    const verifyButtons = screen.getAllByRole("button");
    const verifyButton = Array.from(verifyButtons).find((btn) =>
      btn.textContent?.includes("Verify"),
    );

    if (!verifyButton) throw new Error("Verify button not found");
    fireEvent.click(verifyButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to verify OTP. Please try again.",
      );
    });
  });

  it("navigates back when back button is clicked", () => {
    render(<EmailCode />);

    const backButton = screen.getByText(/back/i).closest("button");
    if (!backButton) throw new Error("Back button not found");
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/inputEmail" });
  });
});
