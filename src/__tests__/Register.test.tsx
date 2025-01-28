import { render, fireEvent, waitFor } from "@testing-library/react";
import Register from "../pages/RegisterPage";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { describe, it, beforeEach, afterEach, vi, expect } from "vitest";
import { toast } from "react-toastify";

describe("Register component", () => {
  const renderWithRouter = (component: React.ReactNode) => {
    return render(<MemoryRouter>{component}</MemoryRouter>);
  };

  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
    window.alert = vi.fn();
    vi.spyOn(toast, "success").mockImplementation(() => "mock-toast-id");
    vi.spyOn(toast, "error").mockImplementation(() => "mock-toast-id");
  });

  afterEach(() => {
    vi.restoreAllMocks(); // Ensure mocks are reset after each test
  });

  it("sends OTP on button click", async () => {
    const { getByText, getByPlaceholderText } = renderWithRouter(
      <Register initialShowSpinner={false} />,
    );

    const phoneNumberInput = getByPlaceholderText("Phone number");
    fireEvent.change(phoneNumberInput, { target: { value: "657040277" } });

    const sendOTPButton = getByText("Send OTP");
    fireEvent.click(sendOTPButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledTimes(1);
    });
  });

  it("displays error message on invalid phone number", async () => {
    const { getByText, getByPlaceholderText } = renderWithRouter(
      <Register initialShowSpinner={false} />,
    );

    const phoneNumberInput = getByPlaceholderText("Phone number");
    fireEvent.change(phoneNumberInput, { target: { value: "invalid" } });

    fireEvent.change(phoneNumberInput, {
      target: { value: "788475847587458" },
    });
    const sendOTPButton = getByText("Send OTP");
    fireEvent.click(sendOTPButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please enter a valid phone number.",
      );
    });
  });

  it("allows only digits in phone number input", () => {
    const { getByPlaceholderText } = renderWithRouter(
      <Register initialShowSpinner={false} />,
    );

    const phoneNumberInput = getByPlaceholderText("Phone number");
    fireEvent.change(phoneNumberInput, { target: { value: "123" } });

    expect(phoneNumberInput).toHaveValue("123");
  });

  it("displays country dropdown on click", () => {
    const { getByText, getByPlaceholderText } = renderWithRouter(
      <Register initialShowSpinner={false} />,
    );

    const countryDropdownButton = getByText("+237");
    fireEvent.click(countryDropdownButton);

    expect(getByPlaceholderText("Search Country")).toBeInTheDocument();
  });

  it("filters country options on search", () => {
    const { getByText, getByPlaceholderText } = renderWithRouter(
      <Register initialShowSpinner={false} />,
    );

    const countryDropdownButton = getByText("+237");
    fireEvent.click(countryDropdownButton);

    const searchInput = getByPlaceholderText("Search Country");
    fireEvent.change(searchInput, { target: { value: "cam" } });

    expect(getByText("Cameroon (+237)")).toBeInTheDocument();
  });
});
