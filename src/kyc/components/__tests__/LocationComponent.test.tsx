import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LocationComponent from "../LocationComponent";
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

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};

Object.defineProperty(global.navigator, "geolocation", {
  value: mockGeolocation,
  writable: true,
});

describe("LocationComponent", () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <LocationComponent />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGeolocation.getCurrentPosition.mockClear();
  });

  it("renders initial state correctly", () => {
    renderComponent();

    expect(screen.getByText("Location Verification")).toBeInTheDocument();
    expect(
      screen.getByTestId("location-residence-message"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Continue with KYC Verification"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("handles successful location retrieval", async () => {
    const mockPosition = {
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    };

    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success(mockPosition);
    });

    renderComponent();

    const continueButton = screen.getByText("Continue with KYC Verification");
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/map-confirmation", {
        state: { coords: { lat: 40.7128, lng: -74.006 } },
      });
    });
  });

  it("handles permission denied error", async () => {
    const mockError = {
      code: 1,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };

    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error(mockError);
    });

    renderComponent();

    const continueButton = screen.getByText("Continue with KYC Verification");
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Location access denied. Please enable permissions in your browser settings.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("handles position unavailable error", async () => {
    const mockError = {
      code: 2,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };

    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error(mockError);
    });

    renderComponent();

    const continueButton = screen.getByText("Continue with KYC Verification");
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(
        screen.getByText("Location information is unavailable."),
      ).toBeInTheDocument();
    });
  });

  it("handles timeout error", async () => {
    const mockError = {
      code: 3,
      PERMISSION_DENIED: 1,
      POSITION_UNAVAILABLE: 2,
      TIMEOUT: 3,
    };

    mockGeolocation.getCurrentPosition.mockImplementation((_, error) => {
      error(mockError);
    });

    renderComponent();

    const continueButton = screen.getByText("Continue with KYC Verification");
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Location request timed out. Please ensure you have GPS enabled.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("handles cancel button click", () => {
    renderComponent();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith("/kyc");
  });

  it("shows loading state during location retrieval", async () => {
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      setTimeout(() => {
        success({
          coords: {
            latitude: 40.7128,
            longitude: -74.006,
          },
        });
      }, 100);
    });

    renderComponent();

    const continueButton = screen.getByText("Continue with KYC Verification");
    fireEvent.click(continueButton);

    expect(screen.getByText("Verifying Location...")).toBeInTheDocument();
  });
});
