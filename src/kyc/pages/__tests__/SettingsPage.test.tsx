import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import SettingsPage from "../SettingsPage";
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

describe("SettingsPage", () => {
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
        <SettingsPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders all menu items", () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Help & Support")).toBeInTheDocument();
    expect(screen.getByText("Email verification")).toBeInTheDocument();
  });
});
