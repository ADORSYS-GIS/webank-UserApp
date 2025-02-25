import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import AgentPage from "../AgentPage";
import { vi } from "vitest";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe("AgentPage", () => {
  test("renders Agent Services heading", () => {
    render(
      <MemoryRouter>
        <AgentPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Agent Services")).toBeInTheDocument();
  });

  test("renders Cash-In button and description", () => {
    render(
      <MemoryRouter>
        <AgentPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Cash-In")).toBeInTheDocument();
    expect(
      screen.getByText("Scan QR code to receive payments"),
    ).toBeInTheDocument();
  });

  test("renders Pay-out button and description", () => {
    render(
      <MemoryRouter>
        <AgentPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Pay-out")).toBeInTheDocument();
    expect(screen.getByText("Payout cash to customers")).toBeInTheDocument();
  });

  test("Cash-In button navigates to /qr-scan", () => {
    const navigate = vi.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <AgentPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Cash-In"));
    expect(navigate).toHaveBeenCalledWith("/qr-scan", {
      state: { otherAccountId: undefined, accountCert: undefined },
    });
  });
});
