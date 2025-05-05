import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ConfirmationBottomSheet from "../ConfirmationPage";
import {
  RequestToTopup,
  RequestToWithdrawOffline,
} from "../../services/keyManagement/requestService";
import { toast } from "sonner";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../../services/keyManagement/requestService", () => ({
  RequestToTopup: vi.fn(),
  RequestToWithdrawOffline: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const mockStore = configureStore({
  reducer: {
    account: () => ({
      kycCert: "test-kyc-cert",
      accountCert: "test-account-cert",
    }),
  },
});

describe("ConfirmationBottomSheet", () => {
  const mockNavigate = vi.fn();
  const mockOnDismiss = vi.fn();
  const mockData = {
    clientAccountId: "client-123",
    amount: 1000,
    agentAccountId: "agent-456",
    agentAccountCert: "agent-cert-789",
    show: "Top up",
    clientName: "John Doe",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (RequestToTopup as jest.Mock).mockResolvedValue(
      "Success transaction-cert-123",
    );
    (RequestToWithdrawOffline as jest.Mock).mockResolvedValue(
      "Success transaction-cert-123",
    );
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <ConfirmationBottomSheet
            data={mockData}
            onDismiss={mockOnDismiss}
            {...props}
          />
        </MemoryRouter>
      </Provider>,
    );
  };

  it("renders confirmation details correctly", () => {
    renderComponent();

    expect(screen.getByText("Confirm Transaction")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("*******123")).toBeInTheDocument();
    expect(screen.getByText("1000 XAF")).toBeInTheDocument();
  });

  it("handles successful top-up transaction", async () => {
    renderComponent();

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(RequestToTopup).toHaveBeenCalledWith(
        "client-123",
        1000,
        "agent-456",
        "test-account-cert",
        "test-kyc-cert",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/success", expect.any(Object));
    });
  });

  it("handles offline withdrawal", async () => {
    const offlineData = {
      ...mockData,
      transactionJwt: "test-jwt",
      show: "Withdrawal",
    };

    renderComponent({ data: offlineData });

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(RequestToWithdrawOffline).toHaveBeenCalledWith(
        "client-123",
        1000,
        "agent-456",
        "test-account-cert",
        "test-jwt",
      );
      expect(mockNavigate).toHaveBeenCalledWith("/success", expect.any(Object));
    });
  });

  it("handles insufficient funds error", async () => {
    (RequestToTopup as jest.Mock).mockResolvedValue("Insufficient funds");

    renderComponent();

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Insufficient funds. Please add funds to your account.",
      );
    });
  });

  it("handles offline state for top-up", () => {
    Object.defineProperty(navigator, "onLine", { value: false });

    renderComponent();

    const confirmButton = screen.getByText("Confirm");
    fireEvent.click(confirmButton);

    expect(toast.info).toHaveBeenCalledWith(
      "Oops, you are offline. Redirecting to the amount page...",
    );
    expect(mockNavigate).toHaveBeenCalledWith("/top-up", expect.any(Object));
  });

  it("handles dismiss action", () => {
    renderComponent();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnDismiss).toHaveBeenCalled();
  });

  it("shows anonymous when client name is not provided", () => {
    const dataWithoutName = {
      ...mockData,
      clientName: undefined,
    };

    renderComponent({ data: dataWithoutName });

    expect(screen.getByText("Anonymous")).toBeInTheDocument();
  });
});
