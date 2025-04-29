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
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../../slices/accountSlice";

// Mock global objects and methods
global.alert = vi.fn();

// Create a mock store
const createMockStore = () => {
  return configureStore({
    reducer: {
      account: accountReducer,
    },
    preloadedState: {
      account: {
        accountId: "mock-account-id",
        accountCert: "mock-cert",
        status: null,
        documentStatus: null,
        kycCert: null,
        emailStatus: null,
        phoneStatus: null,
      },
    },
  });
};

// Mock the service directly
vi.mock("../../services/keyManagement/requestService", () => ({
  RequestToSendOTP: vi.fn(),
}));

describe("Register component", () => {
  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    store = createMockStore();
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
      <Provider store={store}>
        <MemoryRouter>{component}</MemoryRouter>
      </Provider>,
    );
  };

  it("sends OTP on button click", async () => {
    const mockResponse = "otp-hash";
    vi.mocked(RequestToSendOTP).mockResolvedValueOnce(mockResponse);

    const { getByText, getByPlaceholderText } = renderWithRouter(<Register />);
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
    const { getByText, getByPlaceholderText } = renderWithRouter(<Register />);
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
    const { getByText, getByPlaceholderText } = renderWithRouter(<Register />);

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
