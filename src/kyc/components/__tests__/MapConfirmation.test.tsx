import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../../../slices/accountSlice";
import MapConfirmation from "../MapConfirmation";
import { toast } from "sonner";
import "@testing-library/jest-dom";

// Mock the toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

// Mock the router hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Create a mock navigate function
const mockNavigate = vi.fn();

// Mock the RequestToGetUserLocation service
vi.mock("../../../services/keyManagement/requestService", () => ({
  RequestToGetUserLocation: vi.fn().mockImplementation(() => Promise.resolve()),
}));

// Mock fetch
global.fetch = vi.fn();

const mockStore = configureStore({
  reducer: {
    account: accountReducer,
  },
  preloadedState: {
    account: {
      accountCert: "test-cert",
      accountId: "test-id",
      status: null,
      documentStatus: null,
      kycCert: null,
      emailStatus: null,
      phoneStatus: null,
    },
  },
});

describe("MapConfirmation", () => {
  const mockCoords = {
    lat: 40.7128,
    lng: -74.006,
  };

  const renderComponent = (initialPath = "/map-confirmation") => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/map-confirmation" element={<MapConfirmation />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
    (global.fetch as jest.Mock).mockClear();
  });

  it("redirects to location-verification when no coords are provided", () => {
    const { container } = renderComponent();
    expect(container).toBeEmptyDOMElement();
    expect(mockNavigate).toHaveBeenCalledWith("/location-verification");
  });

  it("renders with coords in location state", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/map-confirmation",
              state: { coords: mockCoords },
            },
          ]}
        >
          <Routes>
            <Route path="/map-confirmation" element={<MapConfirmation />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Confirm Your Location")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Does this area match your current residential location?",
      ),
    ).toBeInTheDocument();
  });

  it("fetches and displays city name", async () => {
    const mockCityData = {
      address: {
        city: "New York",
      },
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockCityData),
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/map-confirmation",
              state: { coords: mockCoords },
            },
          ]}
        >
          <Routes>
            <Route path="/map-confirmation" element={<MapConfirmation />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText("📍 New York")).toBeInTheDocument();
    });
  });

  it("handles successful location verification", async () => {
    const { RequestToGetUserLocation } = await import(
      "../../../services/keyManagement/requestService"
    );
    (RequestToGetUserLocation as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <Provider store={mockStore}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/map-confirmation",
              state: { coords: mockCoords },
            },
          ]}
        >
          <Routes>
            <Route path="/map-confirmation" element={<MapConfirmation />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const confirmButton = screen.getByText("Yes, this is my location");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(RequestToGetUserLocation).toHaveBeenCalledWith(
        "test-cert",
        "40.7128,-74.006",
        "test-id",
      );
      expect(toast.success).toHaveBeenCalledWith("Location verified!");
    });

    // Check that navigate is called after the timeout
    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/under-review");
      },
      { timeout: 4000 },
    );
  });

  it("handles verification failure", async () => {
    const { RequestToGetUserLocation } = await import(
      "../../../services/keyManagement/requestService"
    );
    (RequestToGetUserLocation as jest.Mock).mockRejectedValueOnce(
      new Error("Verification failed"),
    );

    render(
      <Provider store={mockStore}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/map-confirmation",
              state: { coords: mockCoords },
            },
          ]}
        >
          <Routes>
            <Route path="/map-confirmation" element={<MapConfirmation />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const confirmButton = screen.getByText("Yes, this is my location");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(
        screen.getByText("Verification failed. Please try again."),
      ).toBeInTheDocument();
    });
  });

  it("handles incorrect location button click", async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/map-confirmation",
              state: { coords: mockCoords },
            },
          ]}
        >
          <Routes>
            <Route path="/map-confirmation" element={<MapConfirmation />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );

    const incorrectButton = screen.getByText("No, this is incorrect");
    fireEvent.click(incorrectButton);

    // Check that navigate was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith("/verification/location");
  });
});
