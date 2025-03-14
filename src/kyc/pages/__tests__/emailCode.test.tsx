import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmailCode from "../emailCode";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";

// Create a mock navigate function
const navigateMock = vi.fn();

// Mock react-router-dom so that useNavigate returns our mock
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Helper to render EmailCode with routing context
const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={["/emailCode"]}>
      <Routes>
        <Route path="/emailCode" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("EmailCode Component", () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  test("renders OTP inputs and buttons", () => {
    renderWithRouter(<EmailCode />);
    // Check that 6 OTP inputs are rendered
    const inputs = screen.getAllByRole("textbox");
    expect(inputs).toHaveLength(6);
    // Check that Verify and Back buttons exist
    expect(screen.getByText("Verify")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  test("shows success message when correct OTP is entered", async () => {
    renderWithRouter(<EmailCode />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const correctOtp = "123456";
    correctOtp.split("").forEach((digit, index) => {
      fireEvent.change(inputs[index], { target: { value: digit } });
    });
    fireEvent.click(screen.getByText("Verify"));

    await waitFor(() =>
      expect(
        screen.getByText(/Successful Email Verification/i),
      ).toBeInTheDocument(),
    );
  });

  test("alerts when incorrect OTP is entered", () => {
    window.alert = vi.fn();
    renderWithRouter(<EmailCode />);
    const inputs = screen.getAllByRole("textbox") as HTMLInputElement[];
    const wrongOtp = "000000";
    wrongOtp.split("").forEach((digit, index) => {
      fireEvent.change(inputs[index], { target: { value: digit } });
    });
    fireEvent.click(screen.getByText("Verify"));
    expect(window.alert).toHaveBeenCalledWith("Invalid OTP. Please try again.");
  });
});
