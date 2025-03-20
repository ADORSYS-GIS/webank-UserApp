import { describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { store } from "../../../store/Store.ts";
import {
  SelectWithPopup,
  DateInput,
  TextInput,
  FormContainer,
} from "../../components/FormComponents";

// Mock the alert function
window.alert = vi.fn();

describe("SelectWithPopup", () => {

  beforeEach(() => {
    indexedDB.deleteDatabase("yourDBName");
  });

  const options = ["Option1", "Option2"];

  const renderSelect = () =>
    render(
      <Provider store={store}>
        <FormContainer title="Test Form" onSubmit={vi.fn()}>
          <SelectWithPopup
            label="Test Label"
            options={options}
            fieldName="testField"
            placeholder="Select an option"
          />
        </FormContainer>
      </Provider>,
    );

  it("renders label and placeholder when no selection", () => {
    renderSelect();
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select an option" }),
    ).toBeInTheDocument();
  });

  it("opens popup when button is clicked", () => {
    renderSelect();
    fireEvent.click(screen.getByRole("button", { name: "Select an option" }));
    expect(screen.getByText("Option1")).toBeInTheDocument();
  });

  it("displays options and selects one", async () => {
    renderSelect();
    fireEvent.click(screen.getByRole("button", { name: "Select an option" }));
    fireEvent.click(screen.getByText("Option1"));
    // Check main button updates
    expect(
      await screen.findByRole("button", { name: "Option1" }),
    ).toBeInTheDocument();
  });

  it("closes popup when cancel is clicked", () => {
    renderSelect();
    fireEvent.click(screen.getByRole("button", { name: "Select an option" }));
    fireEvent.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Option1")).not.toBeInTheDocument();
  });
});

describe("DateInput", () => {
  const renderDateInput = () =>
    render(
      <Provider store={store}>
        <FormContainer title="Test Form" onSubmit={vi.fn()}>
          <DateInput label="Test Date" fieldName="testDate" />
        </FormContainer>
      </Provider>,
    );

  it("renders label and input", () => {
    renderDateInput();
    expect(screen.getByLabelText("Test Date")).toBeInTheDocument();
  });
});

describe("TextInput", () => {
  const renderTextInput = () =>
    render(
      <Provider store={store}>
        <FormContainer title="Test Form" onSubmit={vi.fn()}>
          <TextInput
            label="Test Input"
            fieldName="testInput"
            placeholder="Enter text"
          />
        </FormContainer>
      </Provider>,
    );

  it("renders label and input", () => {
    renderTextInput();
    expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
  });
});

describe("FormContainer", () => {
  it("renders title and children within a form", () => {
    const mockOnSubmit = vi.fn();
    render(
      <Provider store={store}>
        <FormContainer title="Test Form" onSubmit={mockOnSubmit}>
          <div>Child Element</div>
        </FormContainer>
      </Provider>,
    );
    expect(screen.getByText("Test Form")).toBeInTheDocument();
    expect(screen.getByText("Child Element")).toBeInTheDocument();
  });
});
