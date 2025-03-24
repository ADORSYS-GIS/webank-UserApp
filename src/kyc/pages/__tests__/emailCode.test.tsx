import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EmailCode from "../emailCode";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "@testing-library/jest-dom";
import { vi, test, expect, beforeEach } from "vitest";
import { RequestToVerifyEmailCode } from "../../../services/keyManagement/requestService";
import { toast } from "react-toastify";

// Mock react-redux
vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
}));

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
  ToastContainer: vi.fn(),
}));

// Mock react-router-dom
const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...(await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  )),
  useNavigate: () => navigateMock,
  useLocation: () => ({
    state: { email: "test@example.com", accountCert: "testCert" },
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
  });

  test("renders OTP inputs and buttons", () => {
    renderWithRouter(<EmailCode />);
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
    expect(screen.getByText("Verify")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  test("shows success message when correct OTP is entered", async () => {
    vi.mocked(RequestToVerifyEmailCode).mockResolvedValueOnce(
      "Webank email verified successfully",
    );

    renderWithRouter(<EmailCode />);
    const inputs = screen.getAllByRole("textbox");

    // Simulate OTP entry
    "123456".split("").forEach((digit, index) => {
      fireEvent.change(inputs[index], { target: { value: digit } });
    });

    fireEvent.click(screen.getByText("Verify"));

    await waitFor(() => {
      expect(
        screen.getByText("Successful Email Verification"),
      ).toBeInTheDocument();
    });
  });

  test("shows error toast when incorrect OTP is entered", async () => {
    vi.mocked(RequestToVerifyEmailCode).mockRejectedValueOnce(
      new Error("Invalid OTP"),
    );

    renderWithRouter(<EmailCode />);
    const inputs = screen.getAllByRole("textbox");

    // Simulate wrong OTP entry
    "000000".split("").forEach((digit, index) => {
      fireEvent.change(inputs[index], { target: { value: digit } });
    });

    fireEvent.click(screen.getByText("Verify"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Invalid OTP. Please try again.",
      );
    });
  });
});
