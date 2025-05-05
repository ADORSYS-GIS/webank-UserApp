import { render, screen, fireEvent } from "@testing-library/react";
import { RejectionModal } from "../RejectionModal";
import "@testing-library/jest-dom";

describe("RejectionModal", () => {
  const defaultProps = {
    onClose: vi.fn(),
    onReject: vi.fn(),
  };

  it("renders modal with all elements", () => {
    render(<RejectionModal {...defaultProps} />);

    expect(screen.getByText("Reject KYC Verification")).toBeInTheDocument();
    expect(screen.getByText("Select Reason for Rejection")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm Rejection")).toBeInTheDocument();
  });

  it("displays all rejection reasons in dropdown", () => {
    render(<RejectionModal {...defaultProps} />);

    const select = screen.getByLabelText("Select Reason for Rejection");
    fireEvent.click(select);

    expect(screen.getByText("Blurry ID")).toBeInTheDocument();
    expect(screen.getByText("Mismatched Selfie")).toBeInTheDocument();
    expect(screen.getByText("Expired Document")).toBeInTheDocument();
    expect(screen.getByText("Incomplete Information")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<RejectionModal {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: "Close modal" });
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel button is clicked", () => {
    render(<RejectionModal {...defaultProps} />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onReject with selected reason when form is submitted", () => {
    render(<RejectionModal {...defaultProps} />);

    const select = screen.getByLabelText("Select Reason for Rejection");
    fireEvent.change(select, { target: { value: "Blurry ID" } });

    const submitButton = screen.getByText("Confirm Rejection");
    fireEvent.click(submitButton);

    expect(defaultProps.onReject).toHaveBeenCalledWith("Blurry ID");
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does not submit form when no reason is selected", () => {
    render(<RejectionModal {...defaultProps} />);

    const submitButton = screen.getByText("Confirm Rejection");
    fireEvent.click(submitButton);

    expect(defaultProps.onReject).not.toHaveBeenCalled();
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("applies correct styling classes", () => {
    render(<RejectionModal {...defaultProps} />);

    const modalContainer = screen.getByText("Reject KYC Verification")
      .parentElement?.parentElement;
    expect(modalContainer).toHaveClass(
      "bg-white",
      "rounded-lg",
      "max-w-md",
      "w-full",
    );

    const select = screen.getByLabelText("Select Reason for Rejection");
    expect(select).toHaveClass(
      "w-full",
      "p-2",
      "border",
      "border-gray-300",
      "rounded-md",
      "focus:ring-blue-500",
      "focus:border-blue-500",
    );

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton).toHaveClass(
      "px-4",
      "py-2",
      "text-gray-700",
      "bg-gray-100",
      "rounded-md",
      "hover:bg-gray-200",
    );

    const submitButton = screen.getByText("Confirm Rejection");
    expect(submitButton).toHaveClass(
      "px-4",
      "py-2",
      "text-white",
      "bg-rose-600",
      "rounded-md",
      "hover:bg-rose-700",
    );
  });
});
