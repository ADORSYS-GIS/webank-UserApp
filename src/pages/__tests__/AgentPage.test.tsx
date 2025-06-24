import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import AgentPage from "../AgentPage";
import { useAccountStore } from "../../store/accountStore";

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

describe("AgentPage", () => {
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
        <AgentPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Agent Services")).toBeInTheDocument();
  });

  it("renders Agent Services heading", () => {
    render(
      <MemoryRouter>
        <AgentPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Agent Services")).toBeInTheDocument();
  });

  it("renders Cash-In button and description", () => {
    render(
      <MemoryRouter>
        <AgentPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Cash-In")).toBeInTheDocument();
  });

  it("renders Pay-out button and description", () => {
    render(
      <MemoryRouter>
        <AgentPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Pay-out")).toBeInTheDocument();
  });
});
