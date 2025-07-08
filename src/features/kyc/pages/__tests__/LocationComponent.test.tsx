import { render, screen } from "@testing-library/react";
import LocationComponent from "../../components/LocationComponent";
import { useNavigate } from "react-router-dom";
import "@testing-library/jest-dom";
import { vi } from "vitest";

vi.mock("@state/accountStore", () => ({
  useAccountStore: vi.fn(() => ({
    accountCert: "test-cert",
  })),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

describe("LocationComponent - Basic Rendering", () => {
  beforeEach(() => {
    // Mock navigation
    (useNavigate as jest.Mock).mockReturnValue(vi.fn());
    // Mock geolocation
    Object.defineProperty(global.navigator, "geolocation", {
      value: {
        getCurrentPosition: vi.fn(),
        watchPosition: vi.fn(),
        clearWatch: vi.fn(),
      },
      configurable: true,
    });
  });

  it("renders all text elements correctly", () => {
    render(<LocationComponent />);

    // Check main title
    expect(screen.getByText("Location Verification")).toBeInTheDocument();

    // Check description text
    expect(
      screen.getByText(/primary residence\? We need to verify/i),
    ).toBeInTheDocument();

    // Check buttons
    expect(
      screen.getByText("Continue with KYC Verification"),
    ).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    // Check no error message initially
    expect(
      screen.queryByText("Location access denied"),
    ).not.toBeInTheDocument();
  });
});
