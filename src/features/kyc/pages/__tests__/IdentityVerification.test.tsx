// src/features/kyc/pages/__tests__/IdentityVerification.test.tsx
import { render, screen, fireEvent, act } from "@testing-library/react";
import { useNavigate } from "@tanstack/react-router";
import { vi, expect, describe, it, beforeEach } from "vitest";
import "@testing-library/jest-dom";
import { toast } from "sonner";

// Define the shape of our mock store that matches the actual store type
type MockAccountStore = {
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

// Helper function to create a mock store implementation
const createMockStore = (
  state: Partial<MockAccountStore> = {},
): MockAccountStore => ({
  // Default state
  accountId: null,
  accountCert: null,
  status: null,
  documentStatus: null,
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

// Mock external dependencies
vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("@state/accountStore", () => ({
  useAccountStore: vi.fn(),
}));

vi.mock("@features/kyc/components/VerificationModal", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="verification-modal">
      <button onClick={onClose}>Close Modal</button>
    </div>
  ),
}));

// Mock react-feather icons
vi.mock("react-feather", () => ({
  User: ({ className }: { className?: string }) => (
    <div data-testid="icon-user" className={className} />
  ),
  UploadCloud: ({ className }: { className?: string }) => (
    <div data-testid="icon-upload-cloud" className={className} />
  ),
  Check: ({ className }: { className?: string }) => (
    <div data-testid="icon-check" className={className} />
  ),
  ChevronLeft: ({ className }: { className?: string }) => (
    <div data-testid="icon-chevron-left" className={className} />
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <div data-testid="icon-chevron-right" className={className} />
  ),
}));

// Import mocks after setting them up
import IdentityVerification from "../IdentityVerificationPage";
import { useAccountStore } from "@state/accountStore";

// Get mocked modules
const mockUseNavigate = vi.mocked(useNavigate);
const mockUseAccountStore = vi.mocked(useAccountStore);

describe("IdentityVerification", () => {
  const navigateMock = vi.fn();
  let storeState: MockAccountStore;

  // Helper function to update the mock store with type safety
  const updateStore = (updates: Partial<MockAccountStore>) => {
    storeState = { ...storeState, ...updates };
    mockUseAccountStore.mockReturnValue(storeState);
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Initialize store with default state
    storeState = createMockStore({
      accountId: "test-account-id",
      accountCert: "test-account-cert",
    });

    // Set up the initial mock implementation
    mockUseAccountStore.mockReturnValue(storeState);
    mockUseNavigate.mockReturnValue(navigateMock);
  });

  const renderComponent = () => {
    return render(<IdentityVerification />);
  };

  it("renders correctly with initial state", () => {
    renderComponent();

    expect(screen.getByText("Let's Verify Your Identity")).toBeInTheDocument();

    // Find buttons by their step titles
    const personalInfoButton = screen.getByRole("button", {
      name: /personal info/i,
    });
    const uploadButton = screen.getByRole("button", {
      name: /upload documents/i,
    });

    // Check that buttons are interactive by default (not disabled)
    expect(personalInfoButton).not.toHaveClass("cursor-not-allowed");
    expect(uploadButton).not.toHaveClass("cursor-not-allowed");
    expect(personalInfoButton).toHaveClass("cursor-pointer");
    expect(uploadButton).toHaveClass("cursor-pointer");

    expect(screen.queryByTestId("verification-modal")).not.toBeInTheDocument();

    // Check that the submit button is disabled by default (both statuses are null)
    expect(
      screen.getByRole("button", { name: "Secure My Account" }),
    ).toBeDisabled();
  });

  it("navigates back to settings when back button is clicked", () => {
    renderComponent();

    // Find the back button by its text content
    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/settings" });
  });

  it("opens verification modal when Personal Info step is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByText("Personal Info"));
    expect(screen.getByTestId("verification-modal")).toBeInTheDocument();
  });

  it("closes verification modal when onClose is called", () => {
    renderComponent();

    // Open modal
    fireEvent.click(screen.getByText("Personal Info"));
    expect(screen.getByTestId("verification-modal")).toBeInTheDocument();

    // Close modal
    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.queryByTestId("verification-modal")).not.toBeInTheDocument();
  });

  it("navigates to guidelines when Upload Documents step is clicked", () => {
    renderComponent();

    const uploadButton = screen.getByRole("button", {
      name: /upload documents/i,
    });
    fireEvent.click(uploadButton);
    expect(navigateMock).toHaveBeenCalledWith({ to: "/guidelines" });
  });

  it("disables Personal Info step when status is PENDING", async () => {
    // Update store state
    updateStore({ status: "PENDING" });

    await act(async () => {
      renderComponent();
    });

    const personalInfoButton = screen.getByRole("button", {
      name: /personal info/i,
    });
    expect(personalInfoButton).toHaveClass("cursor-not-allowed");
    expect(personalInfoButton).toBeDisabled();
    expect(screen.getByTestId("icon-check")).toBeInTheDocument();
  });

  it("disables Upload Documents step when documentStatus is PENDING", async () => {
    // Update store state
    updateStore({ documentStatus: "PENDING" });

    await act(async () => {
      renderComponent();
    });

    const uploadButton = screen.getByRole("button", {
      name: /upload documents/i,
    });
    expect(uploadButton).toHaveClass("cursor-not-allowed");
    expect(uploadButton).toBeDisabled();
    expect(screen.getByTestId("icon-check")).toBeInTheDocument();
  });

  it("enables submit button when both statuses are PENDING", () => {
    // Update store state
    updateStore({
      status: "PENDING",
      documentStatus: "PENDING",
    });

    renderComponent();

    expect(
      screen.getByRole("button", { name: "Secure My Account" }),
    ).toBeEnabled();
  });

  it("submit button remains disabled when only status is PENDING", () => {
    // Test with only status PENDING
    updateStore({
      status: "PENDING",
      documentStatus: null,
    });

    renderComponent();

    expect(
      screen.getByRole("button", { name: "Secure My Account" }),
    ).toBeDisabled();
  });

  it("submit button remains disabled when only documentStatus is PENDING", () => {
    // Test with only documentStatus PENDING
    updateStore({
      status: null,
      documentStatus: "PENDING",
    });

    renderComponent();

    expect(
      screen.getByRole("button", { name: "Secure My Account" }),
    ).toBeDisabled();
  });

  it("navigates to location verification when submitted with valid account info", () => {
    // Update store state
    updateStore({
      status: "PENDING",
      documentStatus: "PENDING",
    });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Secure My Account" }));

    expect(navigateMock).toHaveBeenCalledWith({ to: "/verification/location" });
  });

  it("shows error toast when accountCert is missing on submit", () => {
    // Update store state with missing accountCert
    updateStore({
      status: "PENDING",
      documentStatus: "PENDING",
      accountId: "test-account-id",
      accountCert: null,
    });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Secure My Account" }));
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
      "Account information is missing",
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("shows error toast when accountId is missing on submit", () => {
    // Update store state with missing accountId
    updateStore({
      status: "PENDING",
      documentStatus: "PENDING",
      accountId: null,
      accountCert: "test-account-cert",
    });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Secure My Account" }));
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
      "Account information is missing",
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("shows error toast when both account info fields are missing on submit", () => {
    // Update store state with missing account info
    updateStore({
      status: "PENDING",
      documentStatus: "PENDING",
      accountId: null,
      accountCert: null,
    });

    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: "Secure My Account" }));
    expect(vi.mocked(toast.error)).toHaveBeenCalledWith(
      "Account information is missing",
    );
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("updates step completion when store statuses change", async () => {
    const { rerender } = renderComponent();

    // Initially both steps should show chevron-right (not completed)
    expect(screen.getAllByTestId("icon-chevron-right")).toHaveLength(2);
    expect(screen.queryByTestId("icon-check")).not.toBeInTheDocument();

    // Update store state to mark Personal Info as complete
    updateStore({ status: "PENDING" });

    await act(async () => {
      rerender(<IdentityVerification />);
    });

    // Should show one check and one chevron
    expect(screen.getByTestId("icon-check")).toBeInTheDocument();
    expect(screen.getByTestId("icon-chevron-right")).toBeInTheDocument();

    // Update store state to mark both as complete
    updateStore({
      status: "PENDING",
      documentStatus: "PENDING",
    });

    await act(async () => {
      rerender(<IdentityVerification />);
    });

    // Should show two checks
    expect(screen.getAllByTestId("icon-check")).toHaveLength(2);
    expect(screen.queryByTestId("icon-chevron-right")).not.toBeInTheDocument();
  });

  it("does not allow interaction with completed steps", () => {
    // Mark both steps as completed
    updateStore({
      status: "PENDING",
      documentStatus: "PENDING",
    });

    renderComponent();

    // Try to interact with completed Personal Info step
    fireEvent.click(screen.getByText("Personal Info"));
    expect(screen.queryByTestId("verification-modal")).not.toBeInTheDocument();

    // Try to interact with completed Upload Documents step
    fireEvent.click(screen.getByText("Upload Documents"));
    // The navigate should not be called since the onClick is set to undefined for completed steps
    expect(navigateMock).not.toHaveBeenCalledWith({ to: "/guidelines" });
  });

  it("shows correct icons for incomplete steps initially", () => {
    renderComponent();

    // Should show chevron-right icons for both incomplete steps
    expect(screen.getAllByTestId("icon-chevron-right")).toHaveLength(2);
    expect(screen.queryByTestId("icon-check")).not.toBeInTheDocument();
  });

  it("displays correct step descriptions", () => {
    renderComponent();

    expect(
      screen.getByText("Enter your address and ID details"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Follow instructions to upload your ID and verification documents",
      ),
    ).toBeInTheDocument();
  });

  it("has correct styling for disabled submit button", () => {
    // Test disabled state
    renderComponent();
    const submitButton = screen.getByRole("button", {
      name: "Secure My Account",
    });
    expect(submitButton).toHaveClass("bg-gray-400", "cursor-not-allowed");
    expect(submitButton).toBeDisabled();
  });

  it("has correct styling for enabled submit button", () => {
    // Update store state first, then render
    updateStore({
      status: "PENDING",
      documentStatus: "PENDING",
    });

    renderComponent();
    const enabledSubmitButton = screen.getByRole("button", {
      name: "Secure My Account",
    });
    expect(enabledSubmitButton).toHaveClass("bg-blue-500");
    expect(enabledSubmitButton).not.toHaveClass("cursor-not-allowed");
    expect(enabledSubmitButton).toBeEnabled();
  });
});
