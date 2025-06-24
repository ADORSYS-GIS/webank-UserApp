// src/kyc/components/IdCapture.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import IdCapture from "../IdCapture";
import "@testing-library/jest-dom";

// Mock the camera functionality
const mockGetUserMedia = vi.fn(() =>
  Promise.resolve({
    getTracks: () => [{ stop: vi.fn() }],
  }),
);

Object.defineProperty(navigator, "mediaDevices", {
  value: {
    getUserMedia: mockGetUserMedia,
  },
  writable: true,
});

describe("IdCapture", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <IdCapture
        onClose={vi.fn()}
        title="Front ID"
        description="Please take a clear picture of the front of your ID card or upload from your device."
        sampleImageSrc="/front-id.png"
      />,
    );
    expect(screen.getByText("Let's Verify Your Identity")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const mockOnClose = vi.fn();
    render(
      <IdCapture
        onClose={mockOnClose}
        title="Front ID"
        description="Please take a clear picture of the front of your ID card or upload from your device."
        sampleImageSrc="/front-id.png"
      />,
    );

    // Get all buttons and click the first one (close button)
    const buttons = screen.getAllByRole("button");
    fireEvent.click(buttons[0]);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
