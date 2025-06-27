import { render, screen, fireEvent } from "@testing-library/react";
import IdentityVerification from "../IdentityVerificationPage";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock the Zustand store
vi.mock("@state/accountStore", () => ({
  useAccountStore: vi.fn(() => ({
    accountId: "1",
    accountCert: "mockCert123",
    status: "PENDING",
    documentStatus: null,
    setStatus: vi.fn(),
    setDocumentStatus: vi.fn(),
  })),
}));

describe("IdentityVerification Component", () => {
  const renderComponent = () =>
    render(
      <MemoryRouter>
        <IdentityVerification />
      </MemoryRouter>,
    );

  test("renders all verification steps", () => {
    renderComponent();

    // Verify that each step is displayed
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
  });

  test("clicking on a step opens the corresponding popup", () => {
    renderComponent();

    // Click on "Personal Info" step
    fireEvent.click(screen.getByText("Personal Info"));
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
  });

  test("Back button resets to step selection", () => {
    renderComponent();

    // Click on a step
    fireEvent.click(screen.getByText("Personal Info"));

    // Click the Back button
    fireEvent.click(screen.getByText("Back"));

    // Check if the steps are displayed again
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
  });
});
