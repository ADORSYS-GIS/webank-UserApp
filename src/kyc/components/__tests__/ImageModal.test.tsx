import { render, screen, fireEvent } from "@testing-library/react";
import { ImageModal } from "../ImageModal";
import "@testing-library/jest-dom";

describe("ImageModal", () => {
  const defaultProps = {
    selectedImage: "test-image.jpg",
    onClose: vi.fn(),
  };

  it("renders modal with image when selectedImage is provided", () => {
    render(<ImageModal {...defaultProps} />);

    expect(screen.getByText("Document Preview")).toBeInTheDocument();
    expect(screen.getByAltText("Enlarged document")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Close modal" }),
    ).toBeInTheDocument();
  });

  it("does not render when selectedImage is null", () => {
    render(<ImageModal {...defaultProps} selectedImage={null} />);

    expect(screen.queryByText("Document Preview")).not.toBeInTheDocument();
    expect(screen.queryByAltText("Enlarged document")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<ImageModal {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: "Close modal" });
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("renders image with correct src", () => {
    render(<ImageModal {...defaultProps} />);

    const image = screen.getByAltText("Enlarged document");
    expect(image).toHaveAttribute("src", "test-image.jpg");
  });
});
