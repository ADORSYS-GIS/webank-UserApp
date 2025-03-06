import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import TopUpPage from "../TopUpPage";
import "@testing-library/jest-dom";

// Mock useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

// Mock the global alert function
vi.stubGlobal("alert", vi.fn());

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

    expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Continue")).toBeInTheDocument();
  });

  it("displays transaction fee and total amount correctly based on the amount", async () => {
    render(
      <MemoryRouter>
        <TopUpPage />
      </MemoryRouter>,
    );

    const inputField = screen.getByPlaceholderText("Enter amount");

    // Case 1: Amount <= 5000 XAF
    fireEvent.input(inputField, { target: { value: "3000" } });
    await waitFor(() => {
      expect(screen.getByText("Transaction Fee: 0 XAF")).toBeInTheDocument();
      expect(screen.getByText("Total Amount: 3000 XAF")).toBeInTheDocument();
    });

    // Case 2: Amount between 5001 XAF and 500000 XAF
    fireEvent.input(inputField, { target: { value: "10000" } });
    await waitFor(() => {
      expect(screen.getByText("Transaction Fee: 1000 XAF")).toBeInTheDocument();
      expect(screen.getByText("Total Amount: 11000 XAF")).toBeInTheDocument();
    });

    // Case 3: Amount > 500000 XAF
    fireEvent.input(inputField, { target: { value: "600000" } });
    await waitFor(() => {
      expect(screen.getByText("Transaction Fee: 1000 XAF")).toBeInTheDocument();
      expect(screen.getByText("Total Amount: 601000 XAF")).toBeInTheDocument();
    });
  });

  it("shows an error message for invalid amounts", async () => {
    render(
      <MemoryRouter>
        <TopUpPage />
      </MemoryRouter>,
    );

    const inputField = screen.getByPlaceholderText("Enter amount");
    const continueButton = screen.getByText("Continue");

    fireEvent.input(inputField, { target: { value: "0" } });
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith("Please enter a valid top-up amount.");
    });

    fireEvent.input(inputField, { target: { value: "600000" } });
    fireEvent.click(continueButton);
    await waitFor(() => {
      expect(alert).toHaveBeenCalledWith(
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

    fireEvent.input(inputField, { target: { value: "10000" } });
    fireEvent.click(continueButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(2);
    });
  });
});
