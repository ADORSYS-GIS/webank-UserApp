import { vi, describe, beforeEach, afterEach, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SuccessPage from "../SuccessPage";
import { useNavigate, useLocation, NavigateFunction } from "react-router-dom";
// Import jest-dom for the toBeInTheDocument matcher
import "@testing-library/jest-dom";
// Mock the CheckCircle icon from lucide-react
vi.mock("lucide-react", () => ({
  CheckCircle: vi.fn(() => <div data-testid="check-circle" />),
}));
// Mock react-router-dom hooks
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn(),
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

    expect(screen.getByText("Transaction ID")).toBeInTheDocument();

    expect(screen.getByText("Payment Time")).toBeInTheDocument();

    expect(screen.getByText("Payment Method")).toBeInTheDocument();

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
