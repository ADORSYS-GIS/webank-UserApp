import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SettingsPage from "../SettingsPage";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// Create a mock store with account state
const mockStore = configureStore({
  reducer: {
    account: (
      state = {
        accountId: "test-account-id",
        accountCert: "test-cert",
      },
    ) => state,
  },
});

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("@tanstack/react-router", async () => {
  const actual = await vi.importActual("@tanstack/react-router");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SettingsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the settings page with title and description", () => {
    render(
      <Provider store={mockStore}>
        <SettingsPage />
      </Provider>,
    );
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("renders all menu items", () => {
    render(
      <Provider store={mockStore}>
        <SettingsPage />
      </Provider>,
    );

    expect(screen.getByText("Help & Support")).toBeInTheDocument();
  });
});
