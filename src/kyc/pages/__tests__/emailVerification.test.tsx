import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputEmail from "../emailVerification";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../../services/keyManagement/requestService", () => ({
  RequestToSendEmailOTP: vi.fn(() => Promise.resolve()),
}));

import { RequestToSendEmailOTP } from "../../../services/keyManagement/requestService";

const mockStore = configureStore();
const store = mockStore({
  account: { accountCert: "mockCert123" },
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
    (RequestToSendEmailOTP as jest.Mock).mockClear();
  });

  test("renders email input and proceed button", () => {
    renderWithProviders(<InputEmail />);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getAllByText("Proceed").length).toBeGreaterThan(0);
  });

  test("navigates to /emailCode for a valid email", async () => {
    renderWithProviders(<InputEmail />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const proceedButton = screen.getAllByText("Proceed")[0];

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(proceedButton);

    await waitFor(() => {
      expect(RequestToSendEmailOTP).toHaveBeenCalledWith(
        "test@example.com",
        "mockCert123",
      );
    });

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/emailCode", {
        state: { email: "test@example.com", accountCert: "mockCert123" },
      });
    });
  });

  test("shows error toast for an invalid email", async () => {
    renderWithProviders(<InputEmail />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const proceedButton = screen.getAllByText("Proceed")[0];

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(proceedButton);

    const errorMessage = await screen.findByText(
      "Please enter a valid email address.",
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test("navigates back when back button is clicked", () => {
    renderWithProviders(<InputEmail />);
    const backButton = screen.getByRole("button", { name: /Go Back/i });
    fireEvent.click(backButton);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
