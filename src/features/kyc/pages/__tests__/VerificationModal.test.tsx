import { describe, it, vi, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import VerificationModal from "../../components/VerificationModal";

// Mock the navigate function from @tanstack/react-router
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

// Mock the motion component from framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    button: ({
      children,
      className,
      onClick,
    }: {
      children: React.ReactNode;
      whileHover?: object;
      whileTap?: object;
      className?: string;
      onClick?: () => void;
    }) => (
      <button className={className} onClick={onClick}>
        {children}
      </button>
    ),
  },
}));

describe("VerificationModal", () => {
  const onClose = vi.fn();

  const renderComponent = () => {
    return render(<VerificationModal onClose={onClose} />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders verification options", () => {
    renderComponent();

    // Verify all document type options are rendered
    expect(screen.getByText("ID CARD")).toBeInTheDocument();
    expect(screen.getByText("PASSPORT")).toBeInTheDocument();
    expect(screen.getByText("DRIVING LICENSE")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    renderComponent();

    // Click on the close button
    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it("navigates to the correct route when ID CARD is clicked", () => {
    renderComponent();

    // Click on ID CARD option
    const idCardButton = screen.getByRole("button", { name: /ID CARD/i });
    fireEvent.click(idCardButton);

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/verification/id-card" });
    expect(onClose).toHaveBeenCalled();
  });

  it("navigates to the correct route when PASSPORT is clicked", () => {
    renderComponent();

    // Click on PASSPORT option
    const passportButton = screen.getByRole("button", { name: /PASSPORT/i });
    fireEvent.click(passportButton);

    expect(mockNavigate).toHaveBeenCalledWith({ to: "/verification/passport" });
    expect(onClose).toHaveBeenCalled();
  });

  it("navigates to the correct route when DRIVING LICENSE is clicked", () => {
    renderComponent();

    // Click on DRIVING LICENSE option
    const drivingLicenseButton = screen.getByRole("button", {
      name: /DRIVING LICENSE/i,
    });
    fireEvent.click(drivingLicenseButton);

    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/verification/driving-license",
    });
    expect(onClose).toHaveBeenCalled();
  });
});
