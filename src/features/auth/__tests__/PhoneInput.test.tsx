import { render, fireEvent, waitFor } from "@testing-library/react";
import Register from "@features/auth/pages/PhoneInput";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { useOtpManagementServicePostApiPrsOtpSend } from "@openapi/generated/prs/queries/queries";
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
import accountReducer from "@state/accountSlice";

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

// Mock the OpenAPI OTP hook
vi.mock("@openapi/generated/prs/queries/queries", () => ({
  useOtpManagementServicePostApiPrsOtpSend: vi.fn(() => ({
    mutateAsync: vi.fn(),
  })),
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
    const mockMutateAsync = vi.fn().mockResolvedValueOnce({ otpHash: "otp-hash" });
    (useOtpManagementServicePostApiPrsOtpSend as unknown as jest.Mock).mockReturnValue({ mutateAsync: mockMutateAsync });

    const { getByText, getByPlaceholderText } = renderWithRouter(<Register />);
    const phoneNumberInput = getByPlaceholderText("Phone number");

    fireEvent.change(phoneNumberInput, { target: { value: "657040277" } });
    fireEvent.click(getByText("Send Verification Code"));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        requestBody: {
          phoneNumber: "+237657040277",
        },
      });
    });
  });

  it("displays error message on invalid phone number", async () => {
    const mockMutateAsync = vi.fn().mockRejectedValueOnce(new Error("Invalid number"));
    (useOtpManagementServicePostApiPrsOtpSend as unknown as jest.Mock).mockReturnValue({ mutateAsync: mockMutateAsync });
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
    const mockMutateAsync = vi.fn().mockRejectedValueOnce(mockError);
    (useOtpManagementServicePostApiPrsOtpSend as unknown as jest.Mock).mockReturnValue({ mutateAsync: mockMutateAsync });
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
