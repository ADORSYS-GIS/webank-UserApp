// src/kyc/components/IdCapture.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import IdCapture from "../IdCapture";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { store } from "../../../store/Store";

// Mock getUserMedia to avoid errors in jsdom
beforeAll(() => {
  Object.defineProperty(navigator, "mediaDevices", {
    value: {
      getUserMedia: vi.fn(() => Promise.resolve({ getTracks: () => [] })),
    },
  });
});

describe("IdCapture", () => {
  const defaultProps = {
    title: "Test Title",
    description: "Test Description",
    sampleImageSrc: "test-image.jpg",
    onClose: vi.fn(),
  };

  it("renders with all props", () => {
    render(
      <Provider store={store}>
        <IdCapture {...defaultProps} />
      </Provider>,
    );

    expect(screen.getByText("Let's Verify Your Identity")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByAltText("Example of a Test Title")).toBeInTheDocument();
    expect(screen.getByText("Upload from WhatsApp")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    render(<IdCapture {...defaultProps} />);

    const closeButton = screen.getByRole("button", { name: "" });
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("opens WhatsApp URL when upload button is clicked", () => {
    const originalOpen = window.open;
    window.open = vi.fn();

    render(<IdCapture {...defaultProps} />);

    const uploadButton = screen.getByText("Upload from WhatsApp");
    fireEvent.click(uploadButton);

    expect(window.open).toHaveBeenCalledWith(
      "https://api.whatsapp.com/",
      "_blank",
    );

    window.open = originalOpen;
  });

  it("applies custom sample image style when provided", () => {
    const customStyle = { width: "200px", height: "200px" };
    render(<IdCapture {...defaultProps} sampleImageStyle={customStyle} />);

    const image = screen.getByAltText("Example of a Test Title");
    expect(image).toHaveStyle(customStyle);
  });
});
