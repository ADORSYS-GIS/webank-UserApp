import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
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
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("AgentPage", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test("renders Agent Services heading", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <AgentPage />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Agent Services")).toBeInTheDocument();
  });

  test("renders Cash-In button and description", () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <AgentPage />
        </MemoryRouter>
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
        <MemoryRouter>
          <AgentPage />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Pay-out")).toBeInTheDocument();
    expect(screen.getByText("Payout cash to customers")).toBeInTheDocument();
  });

  test("Cash-In button navigates to /qr-scan", async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <AgentPage />
        </MemoryRouter>
      </Provider>,
    );

    const cashInButton = screen.getByText("Cash-In");
    fireEvent.click(cashInButton);

    // Wait for the handleClose callback to execute
    await new Promise((resolve) => setTimeout(resolve, 300));

    expect(mockNavigate).toHaveBeenCalledWith("/qr-scan", {
      state: {
        agentAccountId: "test-account-id",
        agentAccountCert: "test-account-cert",
        show: "Top up",
      },
    });
  });
});
