import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsPage from "../SettingsPage";
import { describe, it, vi, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../../store/Store";

describe("SettingsPage", () => {
  it("renders the settings page with title and description", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders all menu items", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText("Help & Support")).toBeInTheDocument();
    expect(screen.getByText("Email verification")).toBeInTheDocument();
  });

  it("triggers click event on menu items", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      </Provider>,
    );

    const helpItem = screen.getByText("Help & Support");
    vi.spyOn(console, "log");

    fireEvent.click(helpItem);
  });
});
