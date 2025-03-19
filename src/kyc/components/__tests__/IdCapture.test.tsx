// src/kyc/components/IdCapture.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import IdCapture from "../IdCapture";
import "@testing-library/jest-dom";

// Mock getUserMedia to avoid errors in jsdom
beforeAll(() => {
  Object.defineProperty(navigator, "mediaDevices", {
    value: {
      getUserMedia: vi.fn(() => Promise.resolve({ getTracks: () => [] })),
    },
  });
});

describe("IdCapture Component", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  test("renders initial view with sample image and Open Camera button", () => {
    render(
      <IdCapture
        onClose={onClose}
        title="Front ID"
        description="Please take a clear picture of the front of your ID card or upload from your device."
        sampleImageSrc="/front-id.png"
        onFileCaptured={() => {
        }}
      />,
    );
    expect(
      screen.getByText(
        /Follow these steps to complete your identity verification securely/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Open Camera")).toBeInTheDocument();
    // Check that the sample image is rendered
    const img = screen.getByAltText(/Example of a Front ID/i);
    expect(img).toHaveAttribute("src", "/front-id.png");
  });

  test("opens camera view when 'Open Camera' is clicked", async () => {
    const { container } = render(
      <IdCapture
        onClose={onClose}
        title="Front ID"
        description="Please take a clear picture of the front of your ID card or upload from your device."
        sampleImageSrc="/front-id.png"
        onFileCaptured={() => {
        }}
      />,
    );

    const openCameraButton = screen.getByText("Open Camera");
    fireEvent.click(openCameraButton);

    // Wait for the video element to appear (indicating camera view)
    await waitFor(() => {
      const video = container.querySelector("video");
      expect(video).toBeInTheDocument();
    });
  });

  test("triggers file upload handler on file selection", async () => {
    render(
      <IdCapture
        onClose={onClose}
        title="Front ID"
        description="Please take a clear picture of the front of your ID card or upload from your device."
        sampleImageSrc="/front-id.png"
        onFileCaptured={() => {
        }}
      />,
    );

    // Simulate file upload
    const file = new File(["dummy content"], "example.png", {
      type: "image/png",
    });
    const fileInput = document.getElementById(
      "frontid-upload",
    ) as HTMLInputElement;
    expect(fileInput).toBeDefined();

    // Fire change event
    fireEvent.change(fileInput, { target: { files: [file] } });
    // The file reader is asynchronous; you can wait for the image to appear
    await waitFor(() => {
      const img = screen.getByAltText("Captured ID");
      expect(img).toBeInTheDocument();
    });
  });

  test("calls onClose when close button is clicked", () => {
    render(
      <IdCapture
        onClose={onClose}
        title="Front ID"
        description="Please take a clear picture of the front of your ID card or upload from your device."
        sampleImageSrc="/front-id.png"
        onFileCaptured={() => {
        }}
      />,
    );
    // In our component, the close button is the second button in the header.
    const headerButtons = screen.getAllByRole("button");
    // Assuming the header has two buttons: back and close, we choose the close button.
    fireEvent.click(headerButtons[1]);
    expect(onClose).toHaveBeenCalled();
  });
});
