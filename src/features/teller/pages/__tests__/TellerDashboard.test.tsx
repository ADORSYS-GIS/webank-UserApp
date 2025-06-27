import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TellerDashboard from "../TellerPage";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// Mock Zustand store
vi.mock("@state/accountStore", () => ({
  useAccountStore: () => ({
    accountId: "test-account-id",
    accountCert: "test-account-cert",
    status: null,
    documentStatus: null,
    kycCert: null,
    emailStatus: null,
    phoneStatus: null,
  }),
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

describe("TellerDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders teller dashboard", () => {
    render(
      <MemoryRouter>
        <TellerDashboard />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Teller Dashboard/i)).toBeInTheDocument();
  });

  // Add more test cases as needed
});
