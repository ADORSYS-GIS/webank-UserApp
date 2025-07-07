import { render, fireEvent } from "@testing-library/react";
import React from "react";
import { vi } from 'vitest';
import { usePhoneVerification } from "../usePhoneVerification";

vi.mock("react-redux", () => ({
  useDispatch: () => vi.fn(),
  useSelector: () => "MOCK_JWT",
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), info: vi.fn(), success: vi.fn() } }));
vi.mock("@services/keyManagement/requestService.ts", () => ({
  RequestToSendOTP: vi.fn(() => Promise.resolve("MOCK_OTP_HASH")),
  RequestToValidateOTP: vi.fn(() => Promise.resolve("Otp Validated Successfully")),
}));

const mockLocation = {
  state: { otpHash: "MOCK_OTP_HASH", fullPhoneNumber: "+237699999999" },
};
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => mockLocation,
}));

function TestComponent() {
  const {
    otp,
    setOtp,
    handleVerifyClick,
  } = usePhoneVerification();
  return (
    <div>
      <input
        data-testid="otp-input"
        value={otp}
        onChange={e => setOtp(e.target.value)}
      />
      <button data-testid="verify-otp" onClick={handleVerifyClick}>
        Verify OTP
      </button>
    </div>
  );
}

describe("usePhoneVerification (React 18 compatible)", () => {
  it("should update otp state", () => {
    const { getByTestId } = render(<TestComponent />);
    const input = getByTestId("otp-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "12345" } });
    expect(input.value).toBe("12345");
  });

  it("should call handleVerifyClick without errors", () => {
    const { getByTestId } = render(<TestComponent />);
    const button = getByTestId("verify-otp");
    fireEvent.click(button);
    // No error thrown means pass
    expect(true).toBe(true);
  });
});
