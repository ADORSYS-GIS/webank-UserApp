import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfirmationPage from "../ConfirmationPage";
import { RequestToTopup } from "../../services/keyManagement/requestService"; // adjust to your import path
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { ToastContainer } from "react-toastify";

// Mock the RequestToTopup function
vi.mock("../../services/keyManagement/requestService", () => ({
  RequestToTopup: vi.fn(),
}));

describe("ConfirmationPage Tests", () => {
  afterEach(() => {
    vi.clearAllMocks(); // Ensure mocks are reset after each test
  });

  test("Confirm button triggers top-up request and navigates on success", async () => {
    (RequestToTopup as jest.Mock).mockResolvedValue("Top-upSuccess");

    render(
      <MemoryRouter>
        <ConfirmationPage />
      </MemoryRouter>,
    );

    // Simulate button click
    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      // Wait for the success toast
      expect(
        screen.getByText("Account successfully topped up."),
      ).toBeInTheDocument();
    });
  });

  test("Confirm button shows error toast if top-up fails", async () => {
    (RequestToTopup as jest.Mock).mockResolvedValue("Top-upFailed");

    render(
      <MemoryRouter>
        <ConfirmationPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      // Check for error message (toast) after the button click
      expect(
        screen.getByText("Phone number Registration failed"),
      ).toBeInTheDocument();
    });
  });

  test("Confirm button shows error toast if an exception occurs", async () => {
    (RequestToTopup as jest.Mock).mockRejectedValue(new Error("Invalid OTP"));

    render(
      <MemoryRouter>
        <ConfirmationPage />
        <ToastContainer />{" "}
        {/* Add ToastContainer to render toasts in the test */}
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      // Check for the error toast message
      expect(screen.getByText("Invalid OTP")).toBeInTheDocument();
    });
  });
});
