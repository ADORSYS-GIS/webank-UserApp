// src/features/kyc/pages/__tests__/IdentityVerification.test.tsx
import { render, screen, fireEvent /*act*/ } from "@testing-library/react";
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

vi.mock("@fortawesome/react-fontawesome", () => ({
  FontAwesomeIcon: ({ icon }: { icon: { iconName: string } }) => (
    <div data-testid={`icon-${icon.iconName}`} />
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
    // Update the mock implementation to handle the selector pattern
    mockUseAccountStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(storeState);
      }
      return storeState;
    });
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
    mockUseAccountStore.mockImplementation((selector) => {
      if (typeof selector === "function") {
        return selector(storeState);
      }
      return storeState;
    });
    mockUseNavigate.mockReturnValue(navigateMock);
  });

  const renderComponent = () => {
    return render(<IdentityVerification />);
  };

  it("renders correctly with initial state", () => {
    renderComponent();

    expect(screen.getByText("Let's Verify Your Identity")).toBeInTheDocument();
    const personalInfoButton = screen.getByRole("button", {
      name: /personal info/i,
    });
    const uploadButton = screen.getByRole("button", {
      name: /upload documents/i,
    });

    // Check that buttons are interactive by default (not disabled)
    expect(personalInfoButton).toHaveClass("cursor-pointer");
    expect(uploadButton).toHaveClass("cursor-pointer");
    expect(screen.queryByTestId("verification-modal")).not.toBeInTheDocument();

    // Check that the submit button is disabled by default
    expect(
      screen.getByRole("button", { name: "Secure My Account" }),
    ).toBeDisabled();
  });

  it("navigates back to settings when back button is clicked", () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /back/i }));
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

  // it("disables Personal Info step when status is PENDING", async () => {
  //   // Update store state
  //   updateStore({ status: "PENDING" });

  //   renderComponent();

  //   const personalInfoButton = screen.getByRole("button", {
  //     name: /personal info/i,
  //   });
  //   expect(personalInfoButton).toHaveClass("cursor-not-allowed");
  //   expect(screen.getByTestId("icon-check")).toBeInTheDocument();
  // });

  // it("disables Upload Documents step when documentStatus is PENDING", async () => {
  //   // Update store state
  //   updateStore({ documentStatus: "PENDING" });

  //   renderComponent();

  //   const uploadButton = screen.getByRole("button", {
  //     name: /upload documents/i,
  //   });
  //   expect(uploadButton).toHaveClass("cursor-not-allowed");
  //   expect(screen.getByTestId("icon-check")).toBeInTheDocument();
  // });

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

  it("shows error toast when account info is missing on submit", () => {
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

  // it("updates step completion when store statuses change", async () => {
  //   const { rerender } = renderComponent();

  //   // Initially both steps should be active
  //   expect(screen.getAllByTestId("icon-chevron-right")).toHaveLength(2);

  //   // Update store state to mark Personal Info as complete
  //   updateStore({ status: "PENDING" });

  //   await act(() => {
  //     rerender(<IdentityVerification />);
  //   });

  //   // Should show one check and one chevron
  //   expect(screen.getByTestId("icon-check")).toBeInTheDocument();
  //   expect(screen.getByTestId("icon-chevron-right")).toBeInTheDocument();

  //   // Update store state to mark both as complete
  //   updateStore({ documentStatus: "PENDING" });

  //   await act(() => {
  //     rerender(<IdentityVerification />);
  //   });

  //   // Should show two checks
  //   expect(screen.getAllByTestId("icon-check")).toHaveLength(2);
  // });

  it("does not allow interaction with completed steps", () => {
    // Mark both steps as completed
    updateStore({
      status: "PENDING",
      documentStatus: "PENDING",
    });

    renderComponent();

    // Try to interact with completed steps
    fireEvent.click(screen.getByText("Personal Info"));
    expect(screen.queryByTestId("verification-modal")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Upload Documents"));
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
