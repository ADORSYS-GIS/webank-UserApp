import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import TellerDashboard from "../TellerPage";
import { MemoryRouter } from "react-router-dom";
import { useAccountStore } from "../../store/accountStore";
import "@testing-library/jest-dom";

describe("TellerDashboard", () => {
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
        <TellerDashboard />
      </MemoryRouter>,
    );
    expect(screen.getByText("Teller Dashboard")).toBeInTheDocument();
  });

  it("shows search input", () => {
    render(
      <MemoryRouter>
        <TellerDashboard />
      </MemoryRouter>,
    );
    expect(
      screen.getByPlaceholderText("Search phoneNumber number..."),
    ).toBeInTheDocument();
  });

  it("shows no data message when no requests found", () => {
    render(
      <MemoryRouter>
        <TellerDashboard />
      </MemoryRouter>,
    );
    expect(screen.getByText("No otp requests found")).toBeInTheDocument();
  });
});
