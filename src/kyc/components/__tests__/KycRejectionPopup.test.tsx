import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import KycRejectionPopup from "../KycRejectionPopup";
import "@testing-library/jest-dom";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("KycRejectionPopup", () => {
  const defaultProps = {
    reason: "Test rejection reason",
    onClose: vi.fn(),
  };

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <KycRejectionPopup {...defaultProps} />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with all content", () => {
    renderComponent();

    expect(screen.getByText("Verification Failed")).toBeInTheDocument();
    expect(
      screen.getByTestId("verification-failed-message"),
    ).toBeInTheDocument();
    expect(screen.getByText("Test rejection reason")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    renderComponent();

    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Cancel button is clicked", () => {
    renderComponent();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("navigates to /kyc and calls onClose when Retry button is clicked", () => {
    renderComponent();

    const retryButton = screen.getByText("Retry");
    fireEvent.click(retryButton);

    expect(mockNavigate).toHaveBeenCalledWith("/kyc");
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("displays the rejection reason correctly", () => {
    const customReason = "Custom rejection reason";
    render(
      <BrowserRouter>
        <KycRejectionPopup {...defaultProps} reason={customReason} />
      </BrowserRouter>,
    );

    expect(screen.getByText(customReason)).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    renderComponent();

    const container = screen.getByText("Verification Failed").parentElement
      ?.parentElement;
    expect(container).toHaveClass(
      "bg-white",
      "rounded-2xl",
      "shadow-xl",
      "max-w-md",
      "w-full",
      "mx-4",
      "p-8",
    );

    const reasonBox = screen.getByTestId("rejection-reason-box");
    expect(reasonBox).toHaveClass(
      "bg-red-50",
      "border",
      "border-red-200",
      "rounded-lg",
      "p-4",
      "mb-6",
      "text-red-700",
    );
  });
});
