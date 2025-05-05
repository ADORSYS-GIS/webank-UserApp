import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { toast } from "sonner";
import IdentityVerification from "../IdentityVerificationPage";
import "@testing-library/jest-dom";

// Mock the toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Create a mock store
const createMockStore = (state = {}) => {
  return configureStore({
    reducer: {
      account: () => ({
        accountCert: "test-cert",
        accountId: "test-id",
        status: "PENDING",
        documentStatus: "PENDING",
        ...state,
      }),
    },
  });
};

describe("IdentityVerificationPage", () => {
  const renderComponent = (storeState = {}) => {
    return render(
      <Provider store={createMockStore(storeState)}>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<IdentityVerification />} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the identity verification page with all elements", () => {
    renderComponent();

    expect(screen.getByText("Let's Verify Your Identity")).toBeInTheDocument();
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
    expect(screen.getByText("Upload Documents")).toBeInTheDocument();
    expect(screen.getByText("Secure My Account")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("navigates to settings when back button is clicked", () => {
    renderComponent();

    const backButton = screen.getByText("Back").closest("button");
    fireEvent.click(backButton!);

    expect(mockNavigate).toHaveBeenCalledWith("/settings");
  });

  it("navigates to location verification when Secure My Account is clicked", () => {
    renderComponent();

    const secureButton = screen.getByText("Secure My Account");
    fireEvent.click(secureButton);

    expect(mockNavigate).toHaveBeenCalledWith("/verification/location");
  });

  it("shows error toast when account information is missing", () => {
    renderComponent({
      accountCert: null,
      accountId: null,
    });

    const secureButton = screen.getByText("Secure My Account");
    fireEvent.click(secureButton);

    expect(toast.error).toHaveBeenCalledWith("Account information is missing");
  });

  it("disables steps when they are completed", () => {
    renderComponent({
      status: "PENDING",
      documentStatus: "PENDING",
    });

    const personalInfoButton = screen
      .getByText("Personal Info")
      .closest("button");
    const uploadDocumentsButton = screen
      .getByText("Upload Documents")
      .closest("button");

    expect(personalInfoButton).toHaveClass("cursor-not-allowed");
    expect(uploadDocumentsButton).toHaveClass("cursor-not-allowed");
  });

  it("enables Secure My Account button when both statuses are PENDING", () => {
    renderComponent({
      status: "PENDING",
      documentStatus: "PENDING",
    });
    const secureButton = screen.getByRole("button", {
      name: "Secure My Account",
    });
    expect(secureButton).not.toHaveClass("cursor-not-allowed");
    expect(secureButton).toHaveClass("bg-blue-500");
  });

  it("disables Secure My Account button when statuses are not PENDING", () => {
    renderComponent({
      status: "COMPLETED",
      documentStatus: "COMPLETED",
    });

    const secureButton = screen.getByRole("button", {
      name: "Secure My Account",
    });
    expect(secureButton).toHaveClass("cursor-not-allowed");
    expect(secureButton).toHaveClass("bg-gray-400");
  });

  it("applies correct styling classes", () => {
    renderComponent();

    const container = screen.getByText("Let's Verify Your Identity")
      .parentElement?.parentElement;
    expect(container).toHaveClass(
      "min-h-screen",
      "bg-white",
      "p-4",
      "md:p-6",
      "max-w-2xl",
      "mx-auto",
    );

    const stepButton = screen.getByText("Personal Info").closest("button");
    expect(stepButton).toHaveClass(
      "p-4",
      "md:p-6",
      "rounded-xl",
      "border",
      "transition-all",
    );

    const secureButton = screen.getByRole("button", {
      name: "Secure My Account",
    });
    expect(secureButton).toHaveClass(
      "w-full",
      "py-4",
      "text-white",
      "font-semibold",
      "rounded-xl",
    );
  });
});
