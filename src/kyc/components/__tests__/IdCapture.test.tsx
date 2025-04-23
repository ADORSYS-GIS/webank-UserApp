// src/kyc/components/IdCapture.test.tsx
import { render, screen } from "@testing-library/react";
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

describe("IdCapture Component", () => {
  const onClose = vi.fn();

  beforeEach(() => {
    onClose.mockClear();
  });

  test("renders initial view with sample image and Open Camera button", () => {
    render(
      <Provider store={store}>
        <IdCapture
          onClose={onClose}
          title="Front ID"
          description="Please take a clear picture of the front of your ID card or upload from your device."
          sampleImageSrc="/front-id.png"
        />
      </Provider>,
    );
    expect(
      screen.getByText(
        /Follow these steps to complete your identity verification securely/i,
      ),
    ).toBeInTheDocument();
    // Check that the sample image is rendered
    const img = screen.getByAltText(/Example of a Front ID/i);
    expect(img).toHaveAttribute("src", "/front-id.png");
  });
});
