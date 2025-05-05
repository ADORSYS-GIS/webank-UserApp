import { renderHook } from "@testing-library/react";
import useDisableScroll from "../useDisableScroll";

describe("useDisableScroll", () => {
  beforeEach(() => {
    // Reset document body style before each test
    document.body.style.overflow = "";
  });

  it("should disable scrolling when mounted", () => {
    renderHook(() => useDisableScroll());
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should re-enable scrolling when unmounted", () => {
    const { unmount } = renderHook(() => useDisableScroll());
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
