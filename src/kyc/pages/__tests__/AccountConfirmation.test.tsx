import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { toast } from "sonner";
import AccountConfirmation from "../AccountConfirmation";
import { RequestToGetRecoveryToken } from "../../../services/keyManagement/requestService";
import "@testing-library/jest-dom";

// Mock the toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock the request service
vi.mock("../../../services/keyManagement/requestService", () => ({
  RequestToGetRecoveryToken: vi.fn(),
}));

// Mock useDisableScroll hook
vi.mock("../../../hooks/useDisableScroll", () => ({
  default: vi.fn(),
}));

// Create a mock store
const createMockStore = (state = {}) => {
  return configureStore({
    reducer: {
      account: () => ({
        accountCert: "test-cert",
        ...state,
      }),
    },
  });
};

interface LocationState {
  accountId?: string;
  oldAccountId?: string;
}

describe("AccountConfirmation", () => {
  const mockNavigate = vi.fn();
  const mockLocation = {
    state: {
      accountId: "new-account-123",
      oldAccountId: "old-account-456",
    } as LocationState,
  };

  const renderComponent = (
    storeState = {},
    locationState: LocationState = mockLocation.state,
  ) => {
    return render(
      <Provider store={createMockStore(storeState)}>
        <MemoryRouter
          initialEntries={[{ pathname: "/", state: locationState }]}
        >
          <Routes>
            <Route path="/" element={<AccountConfirmation />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockClear();
  });

  it("renders account confirmation page with all elements", () => {
    renderComponent();

    expect(
      screen.getByText("Account Recovery Confirmation"),
    ).toBeInTheDocument();
    expect(screen.getByText("Old Account ID:")).toBeInTheDocument();
    expect(screen.getByText("New Account ID:")).toBeInTheDocument();
    expect(screen.getByText("Confirm Recovery")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("displays account IDs from location state", () => {
    renderComponent();

    expect(screen.getByText("old-account-456")).toBeInTheDocument();
    expect(screen.getByText("new-account-123")).toBeInTheDocument();
  });

  it("shows 'Not available' when account IDs are missing", () => {
    renderComponent({}, {} as LocationState);

    expect(screen.getAllByText("Not available")).toHaveLength(2);
  });

  it("handles successful recovery token request", async () => {
    const mockRecoveryToken = "test-recovery-token";
    (RequestToGetRecoveryToken as jest.Mock).mockResolvedValue(
      mockRecoveryToken,
    );

    renderComponent();

    const confirmButton = screen.getByText("Confirm Recovery");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(RequestToGetRecoveryToken).toHaveBeenCalledWith(
        "old-account-456",
        "new-account-123",
        "test-cert",
      );
    });
  });

  it("shows error toast when account details are missing", () => {
    renderComponent({}, {} as LocationState);

    const confirmButton = screen.getByText("Confirm Recovery");
    fireEvent.click(confirmButton);

    expect(toast.error).toHaveBeenCalledWith(
      "Missing account details. Please try the scanning process again.",
    );
  });

  it("shows error toast when recovery token request fails", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    (RequestToGetRecoveryToken as jest.Mock).mockRejectedValue(
      new Error("API Error"),
    );

    renderComponent();

    const confirmButton = screen.getByText("Confirm Recovery");
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Failed to get recovery token. Please try again.",
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Recovery token error:",
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore(); // <-- Restore after test
  });

  it("disables confirm button while submitting", async () => {
    (RequestToGetRecoveryToken as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    renderComponent();

    const confirmButton = screen.getByText("Confirm Recovery");
    fireEvent.click(confirmButton);

    expect(screen.getByText("Processing...")).toBeInTheDocument();
    expect(confirmButton).toBeDisabled();
    expect(confirmButton).toHaveClass("bg-blue-400", "cursor-not-allowed");
  });

  it("applies correct styling classes", () => {
    renderComponent();

    const container = screen.getByText(
      "Account Recovery Confirmation",
    ).parentElement;
    expect(container).toHaveClass(
      "bg-white",
      "rounded-2xl",
      "shadow-xl",
      "p-8",
      "w-full",
      "max-w-lg",
      "text-center",
    );

    const confirmButton = screen.getByText("Confirm Recovery");
    expect(confirmButton).toHaveClass(
      "w-full",
      "py-3",
      "px-6",
      "text-white",
      "font-medium",
      "rounded-lg",
      "transition-colors",
      "shadow-md",
      "bg-blue-600",
      "hover:bg-blue-700",
    );
  });
});
