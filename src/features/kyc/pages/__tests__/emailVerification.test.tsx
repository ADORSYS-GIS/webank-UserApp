import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputEmail from "../emailVerification";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect, vi, beforeEach } from "vitest";

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

// Mock the RequestToSendEmailOTP service
vi.mock("@services/keyManagement/requestService", () => ({
  RequestToSendEmailOTP: vi.fn(() => Promise.resolve("OTP sent successfully")),
}));

import { RequestToSendEmailOTP } from "@services/keyManagement/requestService";

describe("InputEmail Component", () => {
  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <InputEmail />
      </Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email input and proceed button", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Send Verification Code/i }),
    ).toBeInTheDocument();
  });

  it("validates email format before submission", async () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const proceedButton = screen.getByRole("button", {
      name: /Send Verification Code/i,
    });

    // Test invalid email
    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(proceedButton);

    // Should not call the API
    expect(RequestToSendEmailOTP).not.toHaveBeenCalled();
  });

  it("navigates to email code page on successful email submission", async () => {
    renderComponent();
    const emailInput = screen.getByPlaceholderText("name@example.com");
    const proceedButton = screen.getByRole("button", {
      name: /Send Verification Code/i,
    });

    // Enter valid email and submit
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(proceedButton);

    // Should call the API with correct parameters
    await waitFor(() => {
      expect(RequestToSendEmailOTP).toHaveBeenCalledWith(
        "test@example.com",
        "test-cert",
        "test-account-id",
      );
    });

    // Should navigate to email code page
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/emailCode",
      state: {
        email: "test@example.com",
        accountCert: "test-cert",
      },
    });
  });

  it("handles back button click", () => {
    renderComponent();
    const backButton = screen.getByRole("button", { name: /Go Back/i });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/settings",
    });
  });
});
