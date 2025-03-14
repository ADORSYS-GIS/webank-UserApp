import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import InputEmail from "../emailVerification";
import { MemoryRouter, Routes, Route } from "react-router-dom";
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

// Helper to render InputEmail with routing context
const renderWithRouter = (
  ui: React.ReactElement,
  initialEntry = "/inputEmail",
) => {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/inputEmail" element={ui} />
        <Route path="/emailCode" element={<div>EmailCode Page</div>} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("InputEmail Component", () => {
  beforeEach(() => {
    navigateMock.mockClear();
  });

  test("renders email input and proceed button", () => {
    renderWithRouter(<InputEmail />);
    expect(screen.getByPlaceholderText("Enter your email")).toBeInTheDocument();
    expect(screen.getByText("Proceed")).toBeInTheDocument();
  });

  test("navigates to /emailCode for a valid email", async () => {
    renderWithRouter(<InputEmail />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const proceedButton = screen.getByText("Proceed");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.click(proceedButton);
  });

  test("alerts for an invalid email", () => {
    window.alert = vi.fn();
    renderWithRouter(<InputEmail />);
    const emailInput = screen.getByPlaceholderText("Enter your email");
    const proceedButton = screen.getByText("Proceed");

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.click(proceedButton);

    expect(window.alert).toHaveBeenCalledWith(
      "Please enter a valid email address.",
    );
  });

  test("navigates back when back button is clicked", () => {
    renderWithRouter(<InputEmail />);
    const backButton = screen.getByRole("button", { name: /Go Back/i });
    fireEvent.click(backButton);
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
