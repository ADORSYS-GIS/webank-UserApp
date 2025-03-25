import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsPage from "../SettingsPage";
import { describe, it, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";

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
    expect(screen.getByText("Email Verification")).toBeInTheDocument();
    expect(screen.getByText("Verify my ID (KYC)")).toBeInTheDocument();
    expect(screen.getByText("Add Residence")).toBeInTheDocument();
    expect(screen.getByText("Modify Handle")).toBeInTheDocument();
  });

  it("triggers click event on menu items", () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>,
    );

    const helpItem = screen.getByText("Help & Support");
    vi.spyOn(console, "log");

    fireEvent.click(helpItem);

    expect(console.log).toHaveBeenCalledWith("Help & Support");
  });
});
