import React from "react";
import { render, screen } from "@testing-library/react";
import { Component as EmailCode } from "../emailCode";
import { MemoryRouter, Route, Routes } from "react-router";
import "@testing-library/jest-dom";
import { vi, test, expect, beforeEach } from "vitest";
import { RequestToVerifyEmailCode } from '@wua/services/keyManagement/requestService.ts';
import { toast } from "sonner";
import { useSelector } from "react-redux";

// Mock react-redux
vi.mock("react-redux", () => ({
  useDispatch: vi.fn(),
  useSelector: vi.fn(), // Added useSelector mock
}));

// Mock react-toastify
vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  ToastContainer: vi.fn(),
}));

// Mock react-router
const navigateMock = vi.fn();
vi.mock("react-router", async () => ({
  ...(await vi.importActual<typeof import("react-router")>(
    "react-router",
  )),
  useNavigate: () => navigateMock,
  useLocation: () => ({
    state: {
      email: "test@example.com",
      accountCert: "testCert",
      accountId: 1,
    },
  }),
}));

// Mock service directly
vi.mock("../../../services/keyManagement/requestService", () => ({
  RequestToVerifyEmailCode: vi.fn(),
}));

const renderWithRouter = (ui: React.ReactElement) => {
  return render(
    <MemoryRouter initialEntries={["/emailCode"]}>
      <Routes>
        <Route path="/emailCode" element={ui} />
      </Routes>
    </MemoryRouter>,
  );
};

describe("EmailCode Component", () => {
  beforeEach(() => {
    navigateMock.mockClear();
    vi.mocked(RequestToVerifyEmailCode).mockClear();
    vi.mocked(toast.error).mockClear();
    vi.mocked(useSelector).mockReturnValue(1); // Mock accountId
  });

  test("renders OTP inputs and buttons", () => {
    renderWithRouter(<EmailCode />);
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    expect(screen.getByText("Verify")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });
});
