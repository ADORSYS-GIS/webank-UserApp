import { render, screen, fireEvent, act } from "@testing-library/react";
import { useNavigate } from "@tanstack/react-router";
import { vi, expect, describe, it, beforeEach } from "vitest";
import "@testing-library/jest-dom";

// Mock external dependencies
vi.mock("@tanstack/react-router", () => ({
  useNavigate: vi.fn(),
}));

// Mock the geolocation API
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
  watchPosition: vi.fn(),
  clearWatch: vi.fn(),
};

// Use Object.defineProperty to mock the geolocation API
Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
  configurable: true,
});

// Import the component to test
import LocationComponent from "@features/kyc/components/LocationComponent";

describe("LocationComponent", () => {
  let navigateMock: ReturnType<typeof vi.fn>;

  // Helper function to render the component
  const renderComponent = () => {
    return render(<LocationComponent />);
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Set up mock navigation
    navigateMock = vi.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigateMock);

    // Reset the geolocation mock
    mockGeolocation.getCurrentPosition.mockClear();
  });

  it("renders the location verification component", () => {
    renderComponent();

    expect(
      screen.getByRole("heading", { name: /location verification/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/are you currently at your primary residence/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continue with kyc verification/i }),
    ).toBeInTheDocument();
  });

  it("shows loading state when getting location", async () => {
    renderComponent();

    const continueButton = screen.getByRole("button", {
      name: /continue with kyc verification/i,
    });

    // Mock a pending geolocation request - using mockImplementationOnce with no-op function
    mockGeolocation.getCurrentPosition.mockImplementationOnce(() => {
      // Intentionally empty to simulate loading state
      return undefined;
    });

    fireEvent.click(continueButton);

    expect(screen.getByText(/verifying location.../i)).toBeInTheDocument();
  });

  it("handles successful location retrieval", async () => {
    renderComponent();

    const continueButton = screen.getByRole("button", {
      name: /continue with kyc verification/i,
    });

    // Mock successful geolocation
    const mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 100,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    };

    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) => {
      if (success) {
        success(mockPosition);
      }
    });

    await act(async () => {
      fireEvent.click(continueButton);
    });

    expect(navigateMock).toHaveBeenCalledWith({
      to: "/map-confirmation",
      state: {
        coords: {
          lat: mockPosition.coords.latitude,
          lng: mockPosition.coords.longitude,
        },
      },
    });
  });

  it("shows error when location access is denied", async () => {
    renderComponent();

    const continueButton = screen.getByRole("button", {
      name: /continue with kyc verification/i,
    });

    // Mock geolocation error
    const mockError = {
      code: 1, // PERMISSION_DENIED
      message: "User denied geolocation",
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };

    mockGeolocation.getCurrentPosition.mockImplementationOnce(
      (_success, onError) => {
        if (onError) {
          onError(mockError);
        }
      },
    );

    await act(async () => {
      fireEvent.click(continueButton);
    });

    expect(screen.getByText(/location access denied/i)).toBeInTheDocument();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it("allows canceling the location request", async () => {
    renderComponent();

    const cancelButton = screen.getByRole("button", { name: /cancel/i });

    await act(async () => {
      fireEvent.click(cancelButton);
    });

    expect(navigateMock).toHaveBeenCalledWith({ to: "/kyc" });
  });
});
