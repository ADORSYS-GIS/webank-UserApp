import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import AccountQRModal from "../AccountQr";

// Mock QRCodeCanvas
vi.mock("qrcode.react", () => ({
  QRCodeCanvas: vi
    .fn()
    .mockImplementation(({ value }) => (
      <canvas data-testid="qr-code" data-value={value} />
    )),
}));

const mockStore = configureStore({
  reducer: {
    account: () => ({
      accountId: "test-account-123",
    }),
  },
});

describe("AccountQRModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={mockStore}>
        <AccountQRModal isOpen={true} onClose={mockOnClose} {...props} />
      </Provider>,
    );
  };

  it("renders modal when isOpen is true", () => {
    renderComponent();
    expect(screen.getByText("Your QR Code")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    renderComponent({ isOpen: false });
    expect(screen.queryByText("Your QR Code")).not.toBeInTheDocument();
  });

  it("renders QR code with account ID", () => {
    renderComponent();
    const qrCode = screen.getByTestId("qr-code");
    expect(qrCode).toHaveAttribute(
      "data-value",
      expect.stringContaining("test-account-123"),
    );
  });

  it("toggles name inclusion checkbox", () => {
    renderComponent();
    const checkbox = screen.getByLabelText("Include my name in QR code");

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("shows name input when includeName is checked", () => {
    renderComponent();
    const checkbox = screen.getByLabelText("Include my name in QR code");

    fireEvent.click(checkbox);
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("updates QR code when name is included", () => {
    renderComponent();
    const checkbox = screen.getByLabelText("Include my name in QR code");
    fireEvent.click(checkbox);

    const nameInput = screen.getByPlaceholderText("Enter your name");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });

    const qrCode = screen.getByTestId("qr-code");
    expect(qrCode).toHaveAttribute(
      "data-value",
      expect.stringContaining("John Doe"),
    );
  });

  it("calls onClose when close button is clicked", () => {
    renderComponent();
    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onClose when clicking outside modal", () => {
    renderComponent();
    const modal = screen.getByTestId("modal");
    fireEvent.mouseDown(modal);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("triggers download when download button is clicked", () => {
    const createElementSpy = vi.spyOn(document, "createElement");
    const appendChildSpy = vi.spyOn(document.body, "appendChild");
    const removeChildSpy = vi.spyOn(document.body, "removeChild");

    renderComponent();
    const downloadButton = screen.getByText("Download QR Code");
    fireEvent.click(downloadButton);

    expect(createElementSpy).toHaveBeenCalledWith("a");
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
  });
});
