import { render, screen } from "@testing-library/react";
import LocationComponent from "../../components/LocationComponent";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Create a mock store with account state
const mockStore = configureStore({
  reducer: {
    account: (
      state = {
        accountId: "test-account-id",
        accountCert: "test-cert",
      },
    ) => state,
  },
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock geolocation
Object.defineProperty(global.navigator, "geolocation", {
  value: {
    getCurrentPosition: vi.fn(),
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  },
  configurable: true,
});

describe("LocationComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all text elements correctly", () => {
    render(
      <Provider store={mockStore}>
        <LocationComponent />
      </Provider>,
    );

    expect(screen.getByText("Location Verification")).toBeInTheDocument();
    expect(
      screen.getByText(/primary residence\? We need to verify/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Continue with KYC Verification"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(
      screen.queryByText("Location access denied"),
    ).not.toBeInTheDocument();
  });
});
