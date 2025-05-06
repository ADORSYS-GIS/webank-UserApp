import { render, screen, fireEvent } from "@testing-library/react";
import { UserDetailsForm } from "../UserDetailsForm";
import { UserKYC, VerificationFormData } from "../../types/types";
import "@testing-library/jest-dom";

describe("UserDetailsForm", () => {
  const mockUser: UserKYC = {
    id: "1",
    accountId: "user1",
    docNumber: "DOC123",
    expirationDate: "2025-12-31",
    location: "New York",
    email: "user1@example.com",
    status: "PENDING",
    frontID: "front1.jpg",
    backID: "back1.jpg",
    selfie: "selfie1.jpg",
    taxDocument: "tax1.pdf",
  };

  const mockFormData: VerificationFormData = {
    accountId: "user1",
    docNumber: "",
    expirationDate: "",
  };

  const defaultProps = {
    user: mockUser,
    formData: mockFormData,
    onInputChange: vi.fn(),
    onGoBack: vi.fn(),
    onApprove: vi.fn(),
    onReject: vi.fn(),
    onImageClick: vi.fn(),
  };

  it("renders user details correctly", () => {
    render(<UserDetailsForm {...defaultProps} />);

    expect(screen.getByText("KYC Details")).toBeInTheDocument();
    expect(screen.getByText("PENDING")).toBeInTheDocument();
    expect(screen.getByText("New York")).toBeInTheDocument();
    expect(screen.getByText("user1@example.com")).toBeInTheDocument();
  });

  it("renders document cards for all documents", () => {
    render(<UserDetailsForm {...defaultProps} />);

    expect(screen.getByText("Front ID")).toBeInTheDocument();
    expect(screen.getByText("Back ID")).toBeInTheDocument();
    expect(screen.getByText("Selfie")).toBeInTheDocument();
    expect(screen.getByText("Tax Document")).toBeInTheDocument();
  });

  it("calls onGoBack when back button is clicked", () => {
    render(<UserDetailsForm {...defaultProps} />);

    const backButton = screen.getByRole("button", { name: "Back to list" });
    fireEvent.click(backButton);

    expect(defaultProps.onGoBack).toHaveBeenCalledTimes(1);
  });

  it("calls onInputChange when form inputs are changed", () => {
    render(<UserDetailsForm {...defaultProps} />);

    const docNumberInput = screen.getByLabelText("Document Number");
    fireEvent.change(docNumberInput, { target: { value: "NEW123" } });

    const expirationDateInput = screen.getByLabelText("Expiration Date");
    fireEvent.change(expirationDateInput, { target: { value: "2026-01-01" } });

    expect(defaultProps.onInputChange).toHaveBeenCalledTimes(2);
  });

  it("calls onApprove when form is submitted", () => {
    render(<UserDetailsForm {...defaultProps} />);

    const form = screen.getByRole("form");
    fireEvent.submit(form);

    expect(defaultProps.onApprove).toHaveBeenCalledTimes(1);
  });

  it("calls onReject when reject button is clicked", () => {
    render(<UserDetailsForm {...defaultProps} />);

    const rejectButton = screen.getByText("Reject");
    fireEvent.click(rejectButton);

    expect(defaultProps.onReject).toHaveBeenCalledTimes(1);
  });

  it("does not show approve/reject buttons for non-pending status", () => {
    const approvedUser = { ...mockUser, status: "APPROVED" as const };
    render(<UserDetailsForm {...defaultProps} user={approvedUser} />);

    expect(screen.queryByText("Approve")).not.toBeInTheDocument();
    expect(screen.queryByText("Reject")).not.toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<UserDetailsForm {...defaultProps} />);
    const container = screen.getByTestId("user-details-container");
    expect(container).toHaveClass(
      "bg-white",
      "rounded-3xl",
      "shadow-xl",
      "p-6",
      "sm:p-8",
      "space-y-8",
    );

    const statusBadge = screen.getByText("PENDING");
    expect(statusBadge).toHaveClass(
      "px-4",
      "py-2",
      "rounded-full",
      "text-sm",
      "font-medium",
    );

    const docNumberInput = screen.getByLabelText("Document Number");
    expect(docNumberInput).toHaveClass(
      "w-full",
      "px-6",
      "py-4",
      "border-2",
      "border-gray-200",
      "rounded-full",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-blue-500",
      "placeholder-gray-400",
      "transition",
    );
  });
});
