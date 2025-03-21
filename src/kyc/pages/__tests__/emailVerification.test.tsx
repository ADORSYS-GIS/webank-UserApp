import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputEmail from "../emailVerification";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

// Create a mock navigate function
const navigateMock = vi.fn();

// Mock react-router-dom so that useNavigate returns our mock
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock request service
vi.mock("../../../services/keyManagement/requestService", () => ({
  RequestToSendEmailOTP: vi.fn(() => Promise.resolve()), // Mock successful OTP request
}));

import { RequestToSendEmailOTP } from "../../../services/keyManagement/requestService";

// Mock Redux Store
const mockStore = configureStore();
const store = mockStore({
  account: { accountCert: "mockCert123" },
});

// Helper to render InputEmail with routing and Redux context
const renderWithProviders = (
  ui: React.ReactElement,
  initialEntry = "/inputEmail",
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path="/inputEmail" element={ui} />
          <Route path="/emailCode" element={<div>EmailCode Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

describe("InputEmail Component", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    (RequestToSendEmailOTP as jest.Mock).mockClear();
  });

  test("renders email input and proceed button", () => {
    renderWithProviders(<InputEmail />);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByText("Proceed")).toBeInTheDocument();
  });

  test("navigates to /emailCode for a valid email", async () => {
    renderWithProviders(<InputEmail />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const proceedButton = screen.getByText("Proceed");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(proceedButton);

    // Ensure RequestToSendEmailOTP was called
    await waitFor(() => {
      expect(RequestToSendEmailOTP).toHaveBeenCalledWith(
        "test@example.com",
        "mockCert123",
      );
    });

    // Ensure navigation happened
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/emailCode", {
        state: { email: "test@example.com", accountCert: "mockCert123" },
      });
    });
  });

  test("alerts for an invalid email", () => {
    window.alert = vi.fn();
    renderWithProviders(<InputEmail />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const proceedButton = screen.getByText("Proceed");

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(proceedButton);
  });

  test("navigates back when back button is clicked", () => {
    renderWithProviders(<InputEmail />);
    const backButton = screen.getByRole("button", { name: /Go Back/i });
    fireEvent.click(backButton);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
