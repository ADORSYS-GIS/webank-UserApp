import { render, fireEvent } from "@testing-library/react";
import { vi } from 'vitest';
import { useLogin } from "../useLogin";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ state: {} }),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("@shared/projectEnvVariables.ts", () => ({
  getProjectEnvVariables: () => ({ envVariables: { VITE_WEBANK_TELLER_PASSWORD: "testpass" } }),
}));

function TestComponent() {
  const { password, setPassword, error, handleSubmit } = useLogin();
  return (
    <form onSubmit={handleSubmit} data-testid="form">
      <input
        data-testid="password-input"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit">Submit</button>
      <div data-testid="error">{error}</div>
    </form>
  );
}

describe("useLogin (React 18 compatible)", () => {
  it("should update password state", () => {
    const { getByTestId } = render(<TestComponent />);
    const input = getByTestId("password-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input.value).toBe("abc");
  });

  it("should set error on wrong password", () => {
    const { getByTestId } = render(<TestComponent />);
    const input = getByTestId("password-input") as HTMLInputElement;
    const form = getByTestId("form");
    fireEvent.change(input, { target: { value: "wrong" } });
    fireEvent.submit(form);
    expect(getByTestId("error").textContent).toBe("Invalid password. Please try again.");
  });

  it("should not set error on correct password", () => {
    const { getByTestId } = render(<TestComponent />);
    const input = getByTestId("password-input") as HTMLInputElement;
    const form = getByTestId("form");
    fireEvent.change(input, { target: { value: "testpass" } });
    fireEvent.submit(form);
    expect(getByTestId("error").textContent).toBe("");
  });
});
