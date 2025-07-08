import { render, screen } from "@testing-library/react";
import Register from "@features/auth/pages/PhoneInput";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { describe, it, beforeEach, vi, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock global objects and methods
global.alert = vi.fn();

// Mock Zustand store
vi.mock("@state/accountStore", () => ({
  useAccountStore: vi.fn(() => ({
    accountId: "mock-account-id",
    accountCert: "mock-cert",
    status: null,
    documentStatus: null,
    kycCert: null,
    emailStatus: null,
    phoneStatus: null,
  })),
}));

// Mock toast
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock API request
vi.mock("@services/keyManagement/requestService", () => ({
  RequestToSendOTP: vi.fn(),
}));

const queryClient = new QueryClient();

describe("PhoneInput Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders phone input form", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(screen.getByPlaceholderText(/phone number/i)).toBeInTheDocument();
  });
});
