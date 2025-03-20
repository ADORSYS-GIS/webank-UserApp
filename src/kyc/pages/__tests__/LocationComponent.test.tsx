import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import LocationComponent from "../../components/LocationComponent";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

describe("LocationComponent", () => {
  const mockGeolocation = {
    getCurrentPosition: vi.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(navigator, "geolocation", {
      value: mockGeolocation,
      writable: true,
    });
  });

  afterEach(() => vi.clearAllMocks());

  it("renders correctly", () => {
    render(<LocationComponent />);
    expect(screen.getByText("Location Verification")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Continue with KYC Verification/ }),
    ).toBeInTheDocument();
  });

  it("handles successful location retrieval", async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success({ coords: { latitude: 40.7128, longitude: -74.006 } }),
    );

    render(<LocationComponent />);
    await userEvent.click(screen.getByRole("button", { name: /Continue/i }));

    expect(await screen.findByText(/Latitude: 40.712800/)).toBeInTheDocument();
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("handles invalid coordinates", async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce((success) =>
      success({ coords: { latitude: 100, longitude: -200 } }),
    );

    render(<LocationComponent />);
    await userEvent.click(screen.getByRole("button", { name: /Continue/i }));
    expect(
      await screen.findByText("Invalid location coordinates"),
    ).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    mockGeolocation.getCurrentPosition.mockImplementationOnce(() => {});

    render(<LocationComponent />);
    await userEvent.click(screen.getByRole("button", { name: /Continue/i }));

    const button = screen.getByRole("button", {
      name: /Verifying Location.../,
    });
    expect(button).toBeDisabled();
  });
});
