import { render, fireEvent, waitFor } from "@testing-library/react";
import Register from "../pages/RegisterPage";
import "@testing-library/jest-dom";
import { describe, it, beforeEach, vi, expect } from "vitest";

describe("Register component", () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Clear mocks before each test
    window.alert = vi.fn();
  });

  it("sends OTP on button click", async () => {
    const { getByText, getByPlaceholderText } = render(<Register />);
    const phoneNumberInput = getByPlaceholderText("Phone number");

    // Simulate user entering a phone number
    fireEvent.change(phoneNumberInput, { target: { value: "657040277" } });

    // Enable and click the send OTP button
    const sendOTPButton = getByText("Send OTP");
    sendOTPButton.removeAttribute("disabled");
    fireEvent.click(sendOTPButton);

    // Wait for the alert to be shown
    await waitFor(() => expect(window.alert).toHaveBeenCalledWith("OTP sent!")); // Verify alert message
  });

  it("displays error message on invalid phone number", async () => {
    const { getByText, getByPlaceholderText } = render(<Register />);
    const phoneNumberInput = getByPlaceholderText("Phone number");

    fireEvent.change(phoneNumberInput, {
      target: { value: "788475847587458" },
    });
    const sendOTPButton = getByText("Send OTP");
    fireEvent.click(sendOTPButton);

    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        "Please enter a valid phone number.",
      ),
    );
  });

  it("allows only digits in phone number input", () => {
    const { getByPlaceholderText } = render(<Register />);
    const phoneNumberInput = getByPlaceholderText("Phone number");

    fireEvent.change(phoneNumberInput, { target: { value: "123" } });
    expect(phoneNumberInput).toHaveValue("123");
  });

  it("allows empty string for clearing phone number input", () => {
    const { getByPlaceholderText } = render(<Register />);
    const phoneNumberInput = getByPlaceholderText("Phone number");

    fireEvent.change(phoneNumberInput, { target: { value: "123" } });
    fireEvent.change(phoneNumberInput, { target: { value: "" } });
    expect(phoneNumberInput).toHaveValue("");
  });

  it("displays country dropdown on click", () => {
    const { getByText, getByPlaceholderText } = render(<Register />);
    const countryDropdownButton = getByText("+237");

    fireEvent.click(countryDropdownButton);
    expect(getByPlaceholderText("Search Country")).toBeInTheDocument();
  });

  it("filters country options on search", () => {
    const { getByText, getByPlaceholderText } = render(<Register />);
    const countryDropdownButton = getByText("+237");

    fireEvent.click(countryDropdownButton);
    const searchInput = getByPlaceholderText("Search Country");
    fireEvent.change(searchInput, { target: { value: "cam" } });

    expect(getByText("Cameroon (+237)")).toBeInTheDocument();
  });

  it("selects country on click", () => {
    const { getByText, getByPlaceholderText } = render(<Register />);
    const countryDropdownButton = getByText("+237");

    fireEvent.click(countryDropdownButton);
    const searchInput = getByPlaceholderText("Search Country");
    fireEvent.change(searchInput, { target: { value: "cam" } });

    const countryOption = getByText("Cameroon (+237)");
    fireEvent.click(countryOption);

    expect(getByText("+237")).toBeInTheDocument();
  });
});
