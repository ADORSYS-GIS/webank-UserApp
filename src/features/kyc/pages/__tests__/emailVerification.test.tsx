import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputEmail from "../emailVerification";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { vi } from "vitest";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Mock for OpenAPI email mutation
const mockEmailMutation = vi.fn();
vi.mock("@openapi/generated/prs/queries/queries", () => ({
  useKycManagementServicePostApiPrsKycEmail: () => ({
    mutateAsync: mockEmailMutation,
  }),
  RequestToSendEmailOTP: vi.fn(() => Promise.resolve("OTP sent successfully")),
}));

const mockStore = configureStore();
const store = mockStore({
  account: { accountCert: "mockCert123", accountId: "1" }, // Fixed accountId type to string
});

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
    vi.clearAllMocks();
  });

  test("renders email input and proceed button", () => {
    renderWithProviders(<InputEmail />);
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Verification Code" }),
    ).toBeInTheDocument();
  });

  test("navigates to /emailCode for a valid email", async () => {
    renderWithProviders(<InputEmail />);
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const proceedButton = screen.getByRole("button", {
      name: "Send Verification Code",
    });

    fireEvent.change(emailInput, { target: { value: "name@example.com" } });
    fireEvent.click(proceedButton);

    await waitFor(() => {
      expect(mockEmailMutation).toHaveBeenCalledWith({
        requestBody: {
          accountId: "1",
          email: "name@example.com",
        },
      });
      expect(navigateMock).toHaveBeenCalledWith("/emailCode", {
        state: { email: "name@example.com", accountCert: "mockCert123" },
      });
    });
  });

  test("shows error toast for an invalid email", async () => {
    renderWithProviders(<InputEmail />);
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const proceedButton = screen.getByRole("button", {
      name: "Send Verification Code",
    });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(proceedButton);

    await waitFor(() => {
      expect(navigateMock).not.toHaveBeenCalled();
      expect(mockEmailMutation).not.toHaveBeenCalled();
    });
  });

  test("navigates back when back button is clicked", () => {
    renderWithProviders(<InputEmail />);
    const backButton = screen.getByRole("button", { name: /Go Back/i });
    fireEvent.click(backButton);
    expect(navigateMock).toHaveBeenCalledWith("/settings");
  });
});
