// src/kyc/pages/__tests__/RecoverAccountPage.test.tsx
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import RecoverAccountPage from "../RecoverAccountPage";
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

describe("RecoverAccountPage", () => {
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
        <RecoverAccountPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Account Recovery")).toBeInTheDocument();
  });
});
