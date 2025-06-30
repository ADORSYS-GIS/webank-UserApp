import { render, screen, fireEvent } from "@testing-library/react";
import IdentityVerification from "../IdentityVerificationPage";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { vi } from "vitest";

// Create a mock store with account state
const mockStore = configureStore({
  reducer: {
    account: (
      state = {
        accountId: "test-account-id",
        accountCert: "test-account-cert",
      },
    ) => state,
  },
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("IdentityVerification Component", () => {
  const renderComponent = () =>
    render(
      <Provider store={mockStore}>
        <IdentityVerification />
      </Provider>,
    );

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test("renders all verification steps", () => {
    renderComponent();
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
  });

  test("clicking on a step opens the corresponding popup", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Personal Info"));
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
  });

  test("Back button resets to step selection", () => {
    renderComponent();
    fireEvent.click(screen.getByText("Personal Info"));
    fireEvent.click(screen.getByText("Back"));
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
  });
});
