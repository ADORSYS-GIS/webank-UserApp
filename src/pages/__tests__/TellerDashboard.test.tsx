import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TellerDashboard from "../TellerPage";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { toast } from "react-toastify";
import { RequestToGetOtps } from "../../services/keyManagement/requestService";
import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock("../../services/keyManagement/requestService", () => ({
  RequestToGetOtps: vi.fn(),
}));

const mockStore = configureStore([]);
const mockData = [
  { phone: "1234567890", otp: "123456", status: "Pending" },
  { phone: "0987654321", otp: "654321", status: "Sent" },
];

describe("TellerDashboard Component", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;

  beforeEach(() => {
    store = mockStore({
      account: { accountId: "testAccount", accountCert: "testCert" },
    });

    (RequestToGetOtps as jest.Mock).mockResolvedValue(JSON.stringify(mockData));
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <TellerDashboard />
      </Provider>,
    );

  test("renders Teller Dashboard correctly", async () => {
    renderComponent();
    expect(screen.getByText("Teller Dashboard")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search phone number..."),
    ).toBeInTheDocument();
  });

  test("fetches and displays OTP requests", async () => {
    renderComponent();

    await waitFor(() => expect(RequestToGetOtps).toHaveBeenCalledTimes(2));

    expect(screen.getByText("1234567890")).toBeInTheDocument();
    expect(screen.getByText("0987654321")).toBeInTheDocument();
  });

  test("displays error if account information is missing", async () => {
    store = mockStore({ account: { accountId: "", accountCert: "" } });
    renderComponent();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Account information is missing.",
      );
    });
  });

  test("filters OTP requests based on search input", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("1234567890")).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByPlaceholderText("Search phone number..."), {
      target: { value: "0987" },
    });

    expect(screen.queryByText("1234567890")).not.toBeInTheDocument();
    expect(screen.getByText("0987654321")).toBeInTheDocument();
  });

  test("opens WhatsApp link when clicking send button", async () => {
    global.open = vi.fn();

    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("1234567890")).toBeInTheDocument(),
    );

    const sendButton = screen.getAllByTitle("Send via WhatsApp")[0];
    fireEvent.click(sendButton);

    expect(global.open).toHaveBeenCalledWith(
      "https://wa.me/1234567890?text=Your%20OTP%20is%20123456",
      "_blank",
    );
  });

  test("displays 'No OTP requests found' if search doesn't match", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText("1234567890")).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByPlaceholderText("Search phone number..."), {
      target: { value: "99999" },
    });

    expect(screen.getByText("No OTP requests found")).toBeInTheDocument();
  });
});
