import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import EmailVerification from "../emailVerification";
import { MemoryRouter } from "react-router-dom";
import { useAccountStore } from "../../../store/accountStore";
import "@testing-library/jest-dom";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  ...require("react-router-dom"),
  useNavigate: () => vi.fn(),
}));

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock request service
vi.mock("../../../services/keyManagement/requestService", () => ({
  RequestToSendEmailOTP: vi.fn(() => Promise.resolve("OTP sent successfully")),
}));

describe("EmailVerification", () => {
  beforeEach(() => {
    // Reset Zustand store to initial state
    useAccountStore.setState({
      accountId: null,
      accountCert: null,
      status: null,
      documentStatus: null,
      kycCert: null,
      emailStatus: null,
      phoneStatus: null,
    });
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <MemoryRouter>
        <EmailVerification />
      </MemoryRouter>,
    );
    expect(screen.getByText("Email Verification")).toBeInTheDocument();
  });

  it("renders email input and proceed button", () => {
    render(
      <MemoryRouter>
        <EmailVerification />
      </MemoryRouter>,
    );
    expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Send Verification Code" }),
    ).toBeInTheDocument();
  });
});
