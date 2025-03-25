import { render, fireEvent, waitFor } from "@testing-library/react";
import Register from "../RegisterPage";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { RequestToSendOTP } from "../../services/keyManagement/requestService";
import {
  describe,
  it,
  beforeEach,
  vi,
  expect,
  afterEach,
  afterAll,
} from "vitest";
import { toast, ToastContainer } from "react-toastify";

// Mock global objects and methods
global.alert = vi.fn();

// Corrected mock for useInitialization (default export)
vi.mock("../../hooks/useInitialization.ts", () => ({
  default: vi.fn(() => ({
    devCert: "mock-cert",
    error: null,
  })),
}));

// Mock the service directly
vi.mock("../../services/keyManagement/requestService", () => ({
  RequestToSendOTP: vi.fn(),
}));

describe("Register component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");
    vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <MemoryRouter>
        {component}
        <ToastContainer />
      </MemoryRouter>,
    );
  };

  it("sends OTP on button click", async () => {
    const mockResponse = "otp-hash";
    vi.mocked(RequestToSendOTP).mockResolvedValueOnce(mockResponse);

    const { getByText, getByPlaceholderText } = renderWithRouter(
      <Register initialShowSpinner={false} />,
    );
    const phoneNumberInput = getByPlaceholderText("Phone number");

    fireEvent.change(phoneNumberInput, { target: { value: "657040277" } });
    fireEvent.click(getByText("Send OTP"));

    await waitFor(() => {
      expect(RequestToSendOTP).toHaveBeenCalledWith(
        "+237657040277",
        "mock-cert",
      );
      expect(toast.success).toHaveBeenCalledWith("OTP sent!");
    });
  });

  it("displays error message on invalid phone number", async () => {
    vi.mocked(RequestToSendOTP).mockRejectedValueOnce(
      new Error("Invalid number"),
    );
    const { getByText, getByPlaceholderText } = renderWithRouter(
      <Register initialShowSpinner={false} />,
    );
    const phoneNumberInput = getByPlaceholderText("Phone number");

    fireEvent.change(phoneNumberInput, {
      target: { value: "788475847587458" },
    });
    fireEvent.click(getByText("Send OTP"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Please enter a valid phone number.",
      ),
    );
  });

  it("handles API errors gracefully", async () => {
    const mockError = new Error("Network error");
    vi.mocked(RequestToSendOTP).mockRejectedValueOnce(mockError);
    const { getByText, getByPlaceholderText } = renderWithRouter(
      <Register initialShowSpinner={false} />,
    );

    fireEvent.change(getByPlaceholderText("Phone number"), {
      target: { value: "657040277" },
    });
    fireEvent.click(getByText("Send OTP"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to send OTP. Please try again.",
      );
    });
  });
});
