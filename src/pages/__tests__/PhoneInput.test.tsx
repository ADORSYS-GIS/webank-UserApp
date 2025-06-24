import { render, fireEvent, waitFor } from "@testing-library/react";
import Register from "../PhoneInput";
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
import { toast } from "sonner";
import { useAccountStore } from "../../store/accountStore";

// Mock global objects and methods
global.alert = vi.fn();

// Mock the service directly
vi.mock("../../services/keyManagement/requestService", () => ({
  RequestToSendOTP: vi.fn(),
}));

describe("Register component", () => {
  beforeEach(() => {
    // Reset Zustand store to initial state
    useAccountStore.setState({
      accountId: null,
      accountCert: null,
      status: null,
      documentStatus: null,
      kycCert: null,
      emailStatus: null,
      phoneStatus: null,
    });
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

  it("sends OTP on button click", async () => {
    const mockResponse = "otp-hash";
    vi.mocked(RequestToSendOTP).mockResolvedValueOnce(mockResponse);

    // Set up Zustand store state for this test
    useAccountStore.setState({
      accountCert: "mock-cert",
    });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    const phoneNumberInput = getByPlaceholderText("Phone number");

    fireEvent.change(phoneNumberInput, { target: { value: "657040277" } });
    fireEvent.click(getByText("Send Verification Code"));

    await waitFor(() => {
      expect(RequestToSendOTP).toHaveBeenCalledWith(
        "+237657040277",
        "mock-cert",
      );
    });
  });

  it("displays error message on invalid phone number", async () => {
    vi.mocked(RequestToSendOTP).mockRejectedValueOnce(
      new Error("Invalid number"),
    );

    // Set up Zustand store state for this test
    useAccountStore.setState({
      accountCert: "mock-cert",
    });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );
    const phoneNumberInput = getByPlaceholderText("Phone number");

    fireEvent.change(phoneNumberInput, {
      target: { value: "788475847587458" },
    });
    fireEvent.click(getByText("Send Verification Code"));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith(
        "Please enter a valid phone number.",
      ),
    );
  });

  it("handles API errors gracefully", async () => {
    const mockError = new Error("Network error");
    vi.mocked(RequestToSendOTP).mockRejectedValueOnce(mockError);

    // Set up Zustand store state for this test
    useAccountStore.setState({
      accountCert: "mock-cert",
    });

    const { getByText, getByPlaceholderText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>,
    );

    fireEvent.change(getByPlaceholderText("Phone number"), {
      target: { value: "657040277" },
    });
    fireEvent.click(getByText("Send Verification Code"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to send OTP. Please try again.",
      );
    });
  });
});
