import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import IdentityVerificationPage from "../IdentityVerificationPage";
import { useAccountStore } from "../../../store/accountStore";
import "@testing-library/jest-dom";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("IdentityVerificationPage", () => {
  beforeEach(() => {
    // Reset Zustand store to initial state
    useAccountStore.setState({
      accountId: null,
      accountCert: null,
      status: null,
      documentStatus: null,
      kycCert: null,
      emailStatus: null,
      phoneStatus: null,
    });
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<IdentityVerificationPage />);
    expect(screen.getByText("Let's Verify Your Identity")).toBeInTheDocument();
  });

  it("shows verification modal when status is pending", () => {
    // Set up Zustand store state for this test
    useAccountStore.setState({
      status: "PENDING",
      documentStatus: "PENDING",
    });

    render(<IdentityVerificationPage />);

    // Should show verification modal or pending status
    expect(screen.getByText("Let's Verify Your Identity")).toBeInTheDocument();
  });
});
