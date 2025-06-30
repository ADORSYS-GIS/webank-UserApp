import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsPage from "../SettingsPage";
import { describe, it, expect } from "vitest";
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
});
