import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import EmailCode from "../emailCode";
import { MemoryRouter } from "react-router-dom";
import { useAccountStore } from "../../../store/accountStore";
import "@testing-library/jest-dom";

// Mock react-router-dom
vi.mock("react-router-dom", () => ({
  ...require("react-router-dom"),
  useNavigate: () => vi.fn(),
  useLocation: () => ({
    state: {
      email: "test@example.com",
      accountCert: "test-cert",
    },
  }),
}));

describe("EmailCode", () => {
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
        <EmailCode />
      </MemoryRouter>,
    );
    expect(screen.getByText("Verify Your Email")).toBeInTheDocument();
  });
});
