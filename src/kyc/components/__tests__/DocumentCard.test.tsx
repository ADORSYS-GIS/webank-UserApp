import { render, screen, fireEvent } from "@testing-library/react";
import { DocumentCard } from "../DocumentCard";
import "@testing-library/jest-dom";
describe("DocumentCard", () => {
  const defaultProps = {
    title: "Test Document",
    url: "test-url.jpg",
    type: "image" as const,
    onImageClick: vi.fn(),
  };

  it("renders image document card correctly", () => {
    render(<DocumentCard {...defaultProps} />);

    expect(screen.getByText("Test Document")).toBeInTheDocument();
    expect(screen.getByAltText("Test Document")).toBeInTheDocument();
    expect(screen.getByTitle("Download document")).toBeInTheDocument();
  });

  it("renders PDF document card correctly", () => {
    render(<DocumentCard {...defaultProps} type="pdf" />);

    expect(screen.getByText("Test Document")).toBeInTheDocument();
    expect(screen.getByText("PDF Document")).toBeInTheDocument();
    expect(screen.getByText("Download PDF")).toBeInTheDocument();
  });

  it("calls onImageClick when card is clicked", () => {
    render(<DocumentCard {...defaultProps} />);

    const card = screen.getByRole("button", {
      name: "View Test Document document",
    });
    fireEvent.click(card);

    expect(defaultProps.onImageClick).toHaveBeenCalledWith("test-url.jpg");
  });

  it("handles download click for image", () => {
    const createElementSpy = vi.spyOn(document, "createElement");
    const appendChildSpy = vi.spyOn(document.body, "appendChild");
    const removeChildSpy = vi.spyOn(document.body, "removeChild");

    render(<DocumentCard {...defaultProps} />);

    const downloadButton = screen.getByTitle("Download document");
    fireEvent.click(downloadButton);

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });

  it("does not call onImageClick when url is not provided", () => {
    render(<DocumentCard {...defaultProps} url="" />);

    const card = screen.getByRole("button", {
      name: "View Test Document document",
    });
    fireEvent.click(card);

    expect(defaultProps.onImageClick).not.toHaveBeenCalled();
  });
});
