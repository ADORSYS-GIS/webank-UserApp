import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SuccessPage from "../SuccessPage";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation, NavigateFunction } from "react-router-dom";
import "@testing-library/jest-dom";

vi.mock("lucide-react", () => ({
  CheckCircle: vi.fn(() => <div data-testid="check-circle" />),
}));
// Mock react-router-dom hooks
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
}));

vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

describe("SuccessPage", () => {
  let mockNavigate: NavigateFunction; // Explicitly typing mockNavigate as NavigateFunction

  beforeEach(() => {
    mockNavigate = vi.fn(); // Initialize the mockNavigate function

    // Mocking useLocation to return state with transaction details
    (useLocation as jest.Mock).mockReturnValue({
      state: {
        transactionCert: "mock-transaction-cert",
      },
    });

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  // Mock jwtDecode to return a decoded JWT payload
  (jwtDecode as jest.Mock).mockReturnValue({
    amount: 100,
    TranactionID: "123456789",
    paymentTime: Date.now(),
    paymentMethod: "Bank Deposit",
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear all mocks after each test
  });

  test("renders transaction success message with correct parameters", async () => {
    render(<SuccessPage />);

    // Check if the CheckCircle icon is rendered
    expect(screen.getByTestId("check-circle")).toBeInTheDocument();

    // Check if the success message is rendered
    expect(screen.getByText("Payment Success!")).toBeInTheDocument();
    expect(
      screen.getByText("Your payment has been successfully done"),
    ).toBeInTheDocument();

    // Check if the transaction details are correctly displayed
    expect(screen.getByText("Total Payment")).toBeInTheDocument();

    expect(screen.getByText("100")).toBeInTheDocument();

    expect(screen.getByText("Transaction ID")).toBeInTheDocument();

    expect(screen.getByText("Payment Time")).toBeInTheDocument();

    const currentTime = new Date().toLocaleString();

    expect(screen.getByText(currentTime)).toBeInTheDocument();

    expect(screen.getByText("Payment Method")).toBeInTheDocument();

    expect(screen.getByText("Bank Deposit")).toBeInTheDocument();

    // Check if the "Go Back Home" button is rendered
    expect(
      screen.getByRole("button", { name: /go back home/i }),
    ).toBeInTheDocument();
  });

  test("navigates to dashboard when button is clicked", async () => {
    const user = userEvent.setup();
    render(<SuccessPage />);

    // Simulate clicking the "Go Back Home" button
    const button = screen.getByRole("button", { name: /go back home/i });
    await user.click(button);

    // Verify navigation to the dashboard
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});
