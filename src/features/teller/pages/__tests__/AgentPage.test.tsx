import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AgentPage from "../AgentPage";
import { vi } from "vitest";

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

describe("AgentPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders agent page with navigation options", () => {
    render(
      <MemoryRouter>
        <AgentPage />
      </MemoryRouter>,
    );
    expect(
      screen.getByText(/Scan QR code to receive payments/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Cash-In")).toBeInTheDocument();
    expect(screen.getByText("Pay-out")).toBeInTheDocument();
  });
});
