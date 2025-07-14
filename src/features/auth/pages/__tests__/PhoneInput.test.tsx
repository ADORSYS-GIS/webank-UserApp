import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useAccountStore } from "@state/accountStore";
import PhoneInput from "../PhoneInput";

// Mock the phone number parsing function
const mockParsePhoneNumber = vi.fn();

// Mock external dependencies
vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@state/accountStore", () => ({
  useAccountStore: vi.fn(),
}));

vi.mock("libphonenumber-js", () => ({
  default: (number: string) => mockParsePhoneNumber(number),
}));

// Mock the API hook
const mockOtpMutation = { mutateAsync: vi.fn() };
vi.mock("@openapi/generated/prs/queries/queries", () => ({
  useOtpManagementServicePostApiPrsOtpSend: () => mockOtpMutation,
}));

// Mock the countries data
vi.mock("@assets/countries.json", () => ({
  default: [
    { value: "+1", label: "United States", flag: "us-flag.png" },
    { value: "+44", label: "United Kingdom", flag: "uk-flag.png" },
    { value: "+33", label: "France", flag: "fr-flag.png" },
  ],
}));

describe("PhoneInput", () => {
  const mockNavigate = vi.fn();
  const mockAccountStore = {
    accountCert: "test-cert-123",
  };

  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup mocks
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useAccountStore).mockReturnValue(mockAccountStore);

    // Reset toast mocks
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.info).mockClear();

    // Setup default mock for phone number parsing
    mockParsePhoneNumber.mockImplementation((number: string) => ({
      isValid: () => number?.startsWith("+") && number.length > 5,
      number,
      format: () => number,
      country: "US",
      nationalNumber: number?.replace(/^\+\d+/, "") || "",
    }));
  });

  it("renders the phone input form", () => {
    render(<PhoneInput />);

    // Check for the title
    expect(
      screen.getByRole("heading", { name: /verify your phone number/i }),
    ).toBeTruthy();

    // Check for the description
    expect(
      screen.getByText(
        /we'll send a 5-digit verification code to your whatsapp number to ensure your account security\./i,
      ),
    ).toBeTruthy();

    // Check for the phone input
    expect(screen.getByPlaceholderText("Phone number")).toBeTruthy();

    // Check for the send button
    expect(
      screen.getByRole("button", { name: /send verification code/i }),
    ).toBeTruthy();
  });

  it("validates phone number input", async () => {
    render(<PhoneInput />);

    const phoneInput = screen.getByPlaceholderText(
      "Phone number",
    ) as HTMLInputElement;

    // Test invalid input (non-numeric)
    fireEvent.change(phoneInput, { target: { value: "abc" } });
    expect(phoneInput.value).toBe("");

    // Test valid input
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });
    expect(phoneInput.value).toBe("1234567890");
  });

  it("shows error when phone number is empty", async () => {
    render(<PhoneInput />);

    const sendButton = screen.getByRole("button", {
      name: /Send Verification Code/,
    });
    fireEvent.click(sendButton);

    expect(toast.error).toHaveBeenCalledWith("Please enter a phone number.");
    expect(mockOtpMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it("shows error for invalid phone number format", async () => {
    // Mock the phone number validation to fail
    mockParsePhoneNumber.mockImplementationOnce(() => ({
      isValid: () => false,
      number: "+123",
      format: () => "+123",
      country: "US",
      nationalNumber: "123",
    }));

    render(<PhoneInput />);

    // Enter a phone number
    const phoneInput = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneInput, { target: { value: "123" } });

    const sendButton = screen.getByRole("button", {
      name: /Send Verification Code/,
    });
    fireEvent.click(sendButton);

    expect(toast.error).toHaveBeenCalledWith(
      "Please enter a valid phone number.",
    );
    expect(mockOtpMutation.mutateAsync).not.toHaveBeenCalled();
  });

  it("handles country selection", async () => {
    render(<PhoneInput />);

    // Open country dropdown
    const countryButton = screen.getByRole("button", { name: /\+1/ });
    fireEvent.click(countryButton);

    // Wait for dropdown to open and select a different country
    const ukOption = await screen.findByText(/united kingdom/i);
    fireEvent.click(ukOption);

    // Verify country was changed by checking the button text
    const updatedCountryButton = screen.getByRole("button", { name: /\+44/ });
    expect(updatedCountryButton).toBeTruthy();
  });

  it("successfully sends OTP and navigates to verification", async () => {
    const mockOtpHash = "test-otp-hash";
    mockOtpMutation.mutateAsync.mockResolvedValueOnce({ otpHash: mockOtpHash });

    render(<PhoneInput />);

    // Enter a phone number
    const phoneInput = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });

    // Click send button
    const sendButton = screen.getByRole("button", {
      name: /Send Verification Code/,
    });
    fireEvent.click(sendButton);

    // Verify API was called with correct parameters
    await waitFor(() => {
      expect(mockOtpMutation.mutateAsync).toHaveBeenCalledWith({
        requestBody: {
          phoneNumber: "+11234567890", // Default country code +1 + phone number
        },
      });

      // Verify navigation
      expect(mockNavigate).toHaveBeenCalledWith({
        to: "/phone/verification",
        state: {
          otpHash: mockOtpHash,
          fullPhoneNumber: "+11234567890",
        },
      });

      // Verify success message
      expect(toast.info).toHaveBeenCalledWith(
        "One-time code sent. Please check your whatsapp.",
        { duration: 5000 },
      );
    });
  });

  it("handles API error when sending OTP", async () => {
    const errorMessage = "Failed to send OTP";
    mockOtpMutation.mutateAsync.mockRejectedValueOnce(new Error(errorMessage));

    render(<PhoneInput />);

    // Enter a phone number
    const phoneInput = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });

    // Click send button
    const sendButton = screen.getByRole("button", {
      name: /Send Verification Code/,
    });
    fireEvent.click(sendButton);

    // Verify error handling
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to send OTP. Please try again.",
      );
    });
  });

  it("shows error when phone number is already registered", async () => {
    const errorMessage = "Phone number already exists";
    mockOtpMutation.mutateAsync.mockResolvedValueOnce(errorMessage);

    render(<PhoneInput />);

    // Enter a phone number
    const phoneInput = screen.getByPlaceholderText("Phone number");
    fireEvent.change(phoneInput, { target: { value: "1234567890" } });

    // Click send button
    const sendButton = screen.getByRole("button", {
      name: /Send Verification Code/,
    });
    fireEvent.click(sendButton);

    // Verify error message for existing phone number
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Phone number already registered.",
      );
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("navigates back when back button is clicked", () => {
    render(<PhoneInput />);

    // Find the back button by its aria-label
    const backButton = screen.getByRole("button", { name: /back/i });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/settings" });
  });
});
