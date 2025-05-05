import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useKYCReminder } from "../useKYCReminder";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// Mock the dependencies
vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useLocation: vi.fn(),
}));

describe("useKYCReminder", () => {
  const mockUseSelector = useSelector as unknown as ReturnType<typeof vi.fn>;
  const mockUseLocation = useLocation as unknown as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Clear all mocks and session storage before each test
    vi.clearAllMocks();
    sessionStorage.clear();

    // Setup default mock implementations
    mockUseSelector.mockImplementation((selector) => {
      if (selector.toString().includes("kycCert")) return null;
      if (selector.toString().includes("status")) return "NOT_STARTED";
      return null;
    });

    mockUseLocation.mockReturnValue({ pathname: "/dashboard" });
  });

  it("should show reminder on included routes when KYC is not started", () => {
    const { result } = renderHook(() => useKYCReminder());
    expect(result.current.showReminder).toBe(true);
  });

  it("should not show reminder when KYC is pending", () => {
    mockUseSelector.mockImplementation((selector) => {
      if (selector.toString().includes("status")) return "PENDING";
      return null;
    });

    const { result } = renderHook(() => useKYCReminder());
    expect(result.current.showReminder).toBe(false);
  });

  it("should not show reminder on non-included routes", () => {
    mockUseLocation.mockReturnValue({ pathname: "/other-route" });

    const { result } = renderHook(() => useKYCReminder());
    expect(result.current.showReminder).toBe(false);
  });

  it("should not show reminder more than once per session", () => {
    // First render should show the reminder
    const { result, rerender } = renderHook(() => useKYCReminder());
    expect(result.current.showReminder).toBe(true);

    // After closing, it should not show again
    act(() => {
      result.current.handleClose();
    });
    expect(result.current.showReminder).toBe(false);

    // Even if we rerender, it should stay hidden
    rerender();
    expect(result.current.showReminder).toBe(false);
  });

  it("should show reminder again in a new browser instance", () => {
    // First session
    const { result: firstResult } = renderHook(() => useKYCReminder());
    expect(firstResult.current.showReminder).toBe(true);
    act(() => {
      firstResult.current.handleClose();
    });

    // Simulate new browser instance
    sessionStorage.clear();
    sessionStorage.setItem("browserInstance", "true");

    // Second session should show reminder again
    const { result: secondResult } = renderHook(() => useKYCReminder());
    expect(secondResult.current.showReminder).toBe(true);
  });
});
