import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AccountLoadingPage from "../AccountLoadingPage";
import useInitialization from "../../hooks/useInitialization";
import { RequestToCreateBankAccount } from "../../services/keyManagement/requestService";

// Mock dependencies
vi.mock("../../hooks/useInitialization");
vi.mock("../../services/keyManagement/requestService");
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

const mockStore = configureStore({
  reducer: {
    account: () => ({}),
  },
});

describe("AccountLoadingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useInitialization as jest.Mock).mockReturnValue({
      devCert: null,
      error: null,
    });
    (RequestToCreateBankAccount as jest.Mock).mockResolvedValue(
      "Bank account successfully created.\n\naccount123\n\ncert456",
    );
  });

  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <AccountLoadingPage />
        </MemoryRouter>
      </Provider>,
    );
  };

  it("renders loading message and spinner", () => {
    renderComponent();

    expect(
      screen.getByText(/Please wait while we initiate/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Thinking Avatar/i }),
    ).toBeInTheDocument();
  });

  it("renders custom message when provided", () => {
    const customMessage = "Custom loading message";
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <AccountLoadingPage message={customMessage} />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it("handles successful account creation", async () => {
    renderComponent();

    await waitFor(() => {
      expect(localStorage.getItem("accountId")).toBe("account123");
      expect(localStorage.getItem("accountCert")).toBe("cert456");
    });
  });

  it("handles initialization error", async () => {
    (useInitialization as jest.Mock).mockReturnValue({
      devCert: null,
      error: "Initialization failed",
    });

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/Please wait while we initiate/i),
      ).toBeInTheDocument();
    });
  });

  it("handles account creation failure", async () => {
    (RequestToCreateBankAccount as jest.Mock).mockRejectedValue(
      new Error("Account creation failed"),
    );

    renderComponent();

    await waitFor(() => {
      expect(
        screen.getByText(/Please wait while we initiate/i),
      ).toBeInTheDocument();
    });
  });
});
