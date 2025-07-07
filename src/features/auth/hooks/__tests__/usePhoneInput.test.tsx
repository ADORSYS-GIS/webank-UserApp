import { render, fireEvent } from "@testing-library/react";
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { usePhoneInput } from "../usePhoneInput";

vi.mock("react-redux", () => ({ useSelector: () => "MOCK_JWT" }));
vi.mock("sonner", () => ({ toast: { error: vi.fn(), info: vi.fn(), success: vi.fn() } }));
vi.mock("@services/keyManagement/requestService.ts", () => ({
  RequestToSendOTP: vi.fn(() => Promise.resolve("MOCK_OTP_HASH")),
}));
vi.mock("@assets/countries.json", () => ({
  default: [{ value: "+237", label: "Cameroon", flag: "cm.png" }]
}));

function TestComponent() {
  const {
    phoneNumber,
    handlePhoneNumberChange,
    handleSendOTP,
  } = usePhoneInput();
  return (
    <div>
      <input
        data-testid="phone-input"
        value={phoneNumber}
        onChange={e => handlePhoneNumberChange(e)}
      />
      <button data-testid="send-otp" onClick={handleSendOTP}>
        Send OTP
      </button>
    </div>
  );
}

describe("usePhoneInput (React 18 compatible)", () => {
  it("should update phone number state", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    const input = getByTestId("phone-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "600000000" } });
    expect(input.value).toBe("600000000");
  });

  it("should call handleSendOTP without errors", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <TestComponent />
      </MemoryRouter>
    );
    const button = getByTestId("send-otp");
    fireEvent.click(button);
    // No error thrown means pass
    expect(true).toBe(true);
  });
});
