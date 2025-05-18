// src/kyc/pages/__tests__/RecoverAccountPage.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router";
import { Component as RecoverAccountPage } from "../RecoverAccountPage";
import "@testing-library/jest-dom";
import { store } from '@wua/store/Store.ts';
import jest from "jest-mock";

describe("RecoverAccountPage", () => {
  test("renders Recover Account page and handles KYC recovery", () => {
    render(
      <Provider store={store}>
        <Router>
          <RecoverAccountPage />
        </Router>
      </Provider>,
    );

    // Check if the page title is rendered

    // Check if the Initiate KYC Recovery button is rendered
    const kycButton = screen.getByText("Initiate KYC Recovery");
    expect(kycButton).toBeInTheDocument();

    // Mock window.open
    const originalOpen = window.open;
    const openMock = jest.spyOn(window, "open").mockImplementation(() => null);

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
      <Provider store={store}>
        <Router>
          <RecoverAccountPage />
        </Router>
      </Provider>,
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
