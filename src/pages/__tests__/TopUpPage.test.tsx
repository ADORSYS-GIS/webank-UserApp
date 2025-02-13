import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import TopUpPage from "../TopUpPage"; // Adjust the path according to your project structure
import "@testing-library/jest-dom";

// Mock useNavigate
vi.mock("react-router-dom", () => ({
  ...require("react-router-dom"),
  useNavigate: vi.fn(),
}));

// Mock the global alert function
global.alert = vi.fn();

describe("TopUpPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the title, input field, and buttons", () => {
    render(
      <MemoryRouter>
        <TopUpPage />
      </MemoryRouter>,
    );

    // Check that the title is displayed
    expect(screen.getByText("Top-up")).toBeInTheDocument();

    // Check that the input field is displayed
    const inputField = screen.getByPlaceholderText("Enter amount");
    expect(inputField).toBeInTheDocument();

    // Check that the buttons are displayed
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("displays transaction fee correctly based on the amount", () => {
    render(
      <MemoryRouter>
        <TopUpPage />
      </MemoryRouter>,
    );

    const inputField = screen.getByPlaceholderText("Enter amount");

    // Case 1: Amount <= 5000 XAF
    fireEvent.change(inputField, { target: { value: "3000" } });
    expect(screen.getByText("Transaction Fee: 0 XAF")).toBeInTheDocument();

    // Case 2: Amount between 5001 XAF and 500000 XAF
    fireEvent.change(inputField, { target: { value: "10000" } });
    expect(screen.getByText("Transaction Fee: 1000 XAF")).toBeInTheDocument();

    // Case 3: Amount > 500000 XAF
    fireEvent.change(inputField, { target: { value: "600000" } });
    expect(screen.getByText("Transaction Fee: 1000 XAF")).toBeInTheDocument();
  });

  it("shows an error message for invalid amounts", async () => {
    render(
      <MemoryRouter>
        <TopUpPage />
      </MemoryRouter>,
    );

    const inputField = screen.getByPlaceholderText("Enter amount");
    const continueButton = screen.getByText("Continue");

    // Case 1: Amount <= 0
    fireEvent.change(inputField, { target: { value: "0" } });
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "Please enter a valid top-up amount.",
      );
    });

    // Case 2: Amount > 500000 XAF
    fireEvent.change(inputField, { target: { value: "600000" } });
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        "The maximum amount for a single transfer is 500,000 XAF.",
      );
    });
  });

  it("navigates to the QR code page when the amount is valid", async () => {
    const mockNavigate = vi.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <TopUpPage />
      </MemoryRouter>,
    );

    const inputField = screen.getByPlaceholderText("Enter amount");
    const continueButton = screen.getByText("Continue");

    // Enter a valid amount
    fireEvent.change(inputField, { target: { value: "10000" } });
    fireEvent.click(continueButton);

    // Verify that navigation is triggered
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/qr-code?amount=10000");
    });
  });
});
