// src/kyc/pages/__tests__/RecoverAccountPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import RecoverAccountPage from "../RecoverAccountPage";
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";

// Mock the Zustand store
vi.mock("@state/accountStore", () => ({
  useAccountStore: vi.fn(() => ({
    accountId: "1",
    accountCert: "mockCert123",
    setAccountId: vi.fn(),
    setAccountCert: vi.fn(),
  })),
}));

describe("RecoverAccountPage", () => {
  it("renders the recover account page", () => {
    render(
      <MemoryRouter>
        <RecoverAccountPage />
      </MemoryRouter>,
    );
    const heading = screen.getByText((content, element) => {
      return (
        element?.tagName.toLowerCase() === "h2" &&
        content === "Recover Your Account"
      );
    });
    expect(heading).toBeInTheDocument();
  });

  test("renders Recover Account page and handles KYC recovery", () => {
    render(
      <Router>
        <RecoverAccountPage />
      </Router>,
    );

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
      <Router>
        <RecoverAccountPage />
      </Router>,
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
