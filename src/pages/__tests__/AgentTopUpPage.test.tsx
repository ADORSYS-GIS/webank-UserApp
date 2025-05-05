import { render } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, useLocation } from "react-router-dom";
import AgentTopUpPage from "../AgentTopUpPage";
import TopUpForm from "../../components/TopUpForm";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(),
}));

vi.mock("../../components/TopUpForm", () => ({
  default: vi.fn(() => <div data-testid="top-up-form" />),
}));

describe("AgentTopUpPage", () => {
  it("renders TopUpForm with tellerAccountCert from location state", () => {
    const mockTellerCert = "test-teller-cert";
    (useLocation as jest.Mock).mockReturnValue({
      state: { tellerAccountCert: mockTellerCert },
    });

    render(
      <MemoryRouter>
        <AgentTopUpPage />
      </MemoryRouter>,
    );

    expect(TopUpForm).toHaveBeenCalledWith(
      expect.objectContaining({
        tellerAccountCert: mockTellerCert,
      }),
      expect.any(Object),
    );
  });

  it("renders TopUpForm with undefined tellerAccountCert when no state", () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: undefined,
    });

    render(
      <MemoryRouter>
        <AgentTopUpPage />
      </MemoryRouter>,
    );

    expect(TopUpForm).toHaveBeenCalledWith(
      expect.objectContaining({
        tellerAccountCert: undefined,
      }),
      expect.any(Object),
    );
  });
});
