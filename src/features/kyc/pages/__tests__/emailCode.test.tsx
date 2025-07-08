import { render, screen } from "@testing-library/react";
import EmailCode from "../emailCode";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import { vi, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock Zustand store
vi.mock("@state/accountStore", () => ({
  useAccountStore: () => ({
    accountId: "mock-account-id",
    accountCert: "mock-cert",
    status: null,
    documentStatus: null,
    kycCert: null,
    emailStatus: null,
    phoneStatus: null,
    setEmailStatus: vi.fn(),
  }),
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
  RequestToVerifyEmailCode: vi.fn(),
  RequestToSendEmailOTP: vi.fn(),
}));

const queryClient = new QueryClient();

describe("EmailCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email code verification form", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: "/emailCode",
              state: { email: "test@example.com", accountCert: "mock-cert" },
            },
          ]}
        >
          <Routes>
            <Route path="/emailCode" element={<EmailCode />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
    expect(
      screen.getByText("Enter the 6-digit code sent to your email."),
    ).toBeInTheDocument();
  });
});
