import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import RecoverAccountPage from "../RecoverAccountPage";
import "@testing-library/jest-dom";
import { vi } from "vitest";

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

describe("RecoverAccountPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Recover Account page and handles KYC recovery", () => {
    render(
      <Provider store={mockStore}>
        <RecoverAccountPage />
      </Provider>,
    );

    // Check if the page title is rendered

    // Check if the Initiate KYC Recovery button is rendered
    const kycButton = screen.getByText("Initiate KYC Recovery");
    expect(kycButton).toBeInTheDocument();

    // Mock window.open
    const originalOpen = window.open;
    const openMock = vi.spyOn(window, "open").mockImplementation(() => null);

    // Simulate clicking the Initiate KYC Recovery button
    fireEvent.click(kycButton);

    // Check if the WhatsApp link is opened
    expect(openMock).toHaveBeenCalledWith(
      expect.stringContaining("https://api.whatsapp.com/"),
      "_blank",
    );

    // Restore original window.open
    openMock.mockRestore();
    window.open = originalOpen;
  });

  test("handles token submission", async () => {
    render(
      <Provider store={mockStore}>
        <RecoverAccountPage />
      </Provider>,
    );

    // Check if the Input Recovery Token button is rendered
    const tokenButton = screen.getByText("Input Recovery Token");
    expect(tokenButton).toBeInTheDocument();

    // Simulate clicking the Input Recovery Token button
    fireEvent.click(tokenButton);

    // Check if the token input field is rendered
    const tokenInput = screen.getByPlaceholderText("Recovery Token");
    expect(tokenInput).toBeInTheDocument();

    // Simulate entering a token
    fireEvent.change(tokenInput, { target: { value: "test-token" } });
    expect(tokenInput).toHaveValue("test-token");

    // Simulate submitting the token
    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);
  });
});
