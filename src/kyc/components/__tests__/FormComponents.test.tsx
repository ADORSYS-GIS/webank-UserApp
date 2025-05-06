import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { FormContainer, DateInput, TextInput } from "../FormComponents";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "../../../slices/accountSlice";
import { BrowserRouter } from "react-router-dom";
import { toast } from "sonner";
import "@testing-library/jest-dom";

// Mock the toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock the RequestToStoreKYCInfo service
vi.mock("../../../services/keyManagement/requestService", () => {
  return {
    RequestToStoreKYCInfo: vi.fn<
      (
        docId: string,
        expiry: string,
        cert: string | null,
        accountId: string,
      ) => Promise<string>
    >(() => Promise.resolve("")),
  };
});

const mockStore = configureStore({
  reducer: {
    account: accountReducer,
  },
  preloadedState: {
    account: {
      accountCert: "test-cert",
      accountId: "test-id",
      status: null,
      documentStatus: null,
      kycCert: null,
      emailStatus: null,
      phoneStatus: null,
    },
  },
});

describe("FormContainer", () => {
  const renderFormContainer = (props = {}) => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <FormContainer title="Test Form" onSubmit={vi.fn()} {...props}>
            <TextInput
              label="Document Number"
              fieldName="UniqueDocumentIdentifier"
              placeholder="Enter document number"
            />
            <DateInput label="Expiry Date" fieldName="expiry" />
          </FormContainer>
        </BrowserRouter>
      </Provider>,
    );
  };
  it("renders form with title and children", () => {
    renderFormContainer();
    expect(screen.getByText("Test Form")).toBeInTheDocument();
    expect(screen.getByLabelText("Document Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Expiry Date")).toBeInTheDocument();
  });

  it("handles form submission with valid data", async () => {
    const onSubmit = vi.fn();
    const { RequestToStoreKYCInfo } = await import(
      "../../../services/keyManagement/requestService"
    );
    vi.mocked(RequestToStoreKYCInfo).mockResolvedValue(
      "KYC Info sent successfully and saved.",
    );
    renderFormContainer({ onSubmit });

    // Fill both required fields
    const docInput = screen.getByLabelText("Document Number");
    fireEvent.change(docInput, { target: { value: "DOC123" } });

    const dateInput = screen.getByLabelText("Expiry Date");
    fireEvent.change(dateInput, { target: { value: "2025-12-31" } });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(RequestToStoreKYCInfo).toHaveBeenCalledWith(
        "DOC123",
        "2025-12-31",
        "test-cert",
        "test-id",
      );
      expect(toast.success).toHaveBeenCalledWith(
        "KYC Info sent successfully and saved.",
      );
      expect(onSubmit).toHaveBeenCalled();
    });
  });
  it("shows error toast when required fields are missing", async () => {
    const onSubmit = vi.fn();
    renderFormContainer({ onSubmit });

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Please fill in all the required fields",
      );
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it("handles cancel button click", () => {
    const onCancel = vi.fn();
    renderFormContainer({ onCancel });

    const cancelButton = screen.getByText("×");
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });
});

describe("DateInput", () => {
  const renderDateInput = (props = {}) => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <FormContainer title="Test Form" onSubmit={vi.fn()}>
            <DateInput label="Test Date" fieldName="testDate" {...props} />
          </FormContainer>
        </BrowserRouter>
      </Provider>,
    );
  };

  it("renders date input with label", () => {
    renderDateInput();
    expect(screen.getByLabelText("Test Date")).toBeInTheDocument();
  });

  it("changes input type on focus and blur", () => {
    renderDateInput();
    const input = screen.getByLabelText("Test Date");

    fireEvent.focus(input);
    expect(input).toHaveAttribute("type", "date");

    fireEvent.blur(input);
    expect(input).toHaveAttribute("type", "text");
  });

  it("updates form data when date is changed", () => {
    renderDateInput();
    const input = screen.getByLabelText("Test Date");

    fireEvent.change(input, { target: { value: "2023-01-01" } });
    expect(input).toHaveValue("2023-01-01");
  });
});

describe("TextInput", () => {
  const renderTextInput = (props = {}) => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          <FormContainer title="Test Form" onSubmit={vi.fn()}>
            <TextInput
              label="Test Input"
              fieldName="testField"
              placeholder="Enter test value"
              {...props}
            />
          </FormContainer>
        </BrowserRouter>
      </Provider>,
    );
  };

  it("renders text input with label and placeholder", () => {
    renderTextInput();
    expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter test value")).toBeInTheDocument();
  });

  it("updates form data when text is changed", () => {
    renderTextInput();
    const input = screen.getByLabelText("Test Input");

    fireEvent.change(input, { target: { value: "test value" } });
    expect(input).toHaveValue("test value");
  });
});
