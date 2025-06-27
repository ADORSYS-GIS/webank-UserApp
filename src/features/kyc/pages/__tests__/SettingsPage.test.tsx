import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsPage from "../SettingsPage";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Mock the Zustand store
vi.mock("@state/accountStore", () => ({
  useAccountStore: () => ({
    emailStatus: "APPROVED",
    phoneStatus: "APPROVED",
    accountId: "mock-account-id",
    accountCert: "mock-account-cert",
  }),
}));

describe("SettingsPage", () => {
  it("renders the settings page with title and description", () => {
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
