import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AgentPage from "../AgentPage";
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

describe("AgentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders Agent Services heading", () => {
    render(
      <Provider store={mockStore}>
        <AgentPage />
      </Provider>,
    );

    expect(screen.getByText("Agent Services")).toBeInTheDocument();
  });

  test("renders Cash-In button and description", () => {
    render(
      <Provider store={mockStore}>
        <AgentPage />
      </Provider>,
    );

    expect(screen.getByText("Cash-In")).toBeInTheDocument();
    expect(
      screen.getByText("Scan QR code to receive payments"),
    ).toBeInTheDocument();
  });

  test("renders Pay-out button and description", () => {
    render(
      <Provider store={mockStore}>
        <AgentPage />
      </Provider>,
    );

    expect(screen.getByText("Pay-out")).toBeInTheDocument();
    expect(
      screen.getByText("Help customers withdraw offline"),
    ).toBeInTheDocument();
  });

  test("Cash-In button triggers navigation", async () => {
    render(
      <Provider store={mockStore}>
        <AgentPage />
      </Provider>,
    );

    const cashInButton = screen.getByText("Cash-In");
    fireEvent.click(cashInButton);

    // Wait for the handleClose callback to execute
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check if navigate was called with the correct arguments
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/qr-scan/top-up",
      state: {
        agentAccountId: "test-account-id",
        agentAccountCert: "test-account-cert",
      },
    });
  });
});
