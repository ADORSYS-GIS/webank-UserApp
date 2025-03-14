// FormComponents.test.tsx
import { describe, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import {
  SelectWithPopup,
  DateInput,
  TextInput,
  FormContainer,
} from "../../components/FormComponents";

// SelectWithPopup Tests
describe("SelectWithPopup", () => {
  const options = ["Option1", "Option2"];
  const mockOnSelect = vi.fn();
  const mockSetShowPopup = vi.fn();

  it("renders label and placeholder when no selection", () => {
    render(
      <SelectWithPopup
        label="Test Label"
        options={options}
        selectedValue=""
        onSelect={mockOnSelect}
        placeholder="Select an option"
        showPopup={false}
        setShowPopup={mockSetShowPopup}
      />,
    );
    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Select an option" }),
    ).toBeInTheDocument();
  });

  it("opens popup when button is clicked", () => {
    render(
      <SelectWithPopup
        label="Test Label"
        options={options}
        selectedValue=""
        onSelect={mockOnSelect}
        placeholder="Select an option"
        showPopup={false}
        setShowPopup={mockSetShowPopup}
      />,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(mockSetShowPopup).toHaveBeenCalledWith(true);
  });

  it("displays options and selects one", () => {
    render(
      <SelectWithPopup
        label="Test Label"
        options={options}
        selectedValue=""
        onSelect={mockOnSelect}
        placeholder="Select an option"
        showPopup={true}
        setShowPopup={mockSetShowPopup}
      />,
    );
    fireEvent.click(screen.getByText("Option1"));
    expect(mockOnSelect).toHaveBeenCalledWith("Option1");
    expect(mockSetShowPopup).toHaveBeenCalledWith(false);
  });

  it("closes popup when cancel is clicked", () => {
    render(
      <SelectWithPopup
        label="Test Label"
        options={options}
        selectedValue=""
        onSelect={mockOnSelect}
        placeholder="Select an option"
        showPopup={true}
        setShowPopup={mockSetShowPopup}
      />,
    );
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockSetShowPopup).toHaveBeenCalledWith(false);
  });
});

// DateInput Tests
describe("DateInput", () => {
  it("renders label and input with placeholder", () => {
    render(<DateInput label="Test Date" id="test-date" />);
    expect(screen.getByLabelText("Test Date")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Select Test Date")).toHaveAttribute(
      "type",
      "text",
    );
  });

  it("changes input type to date on focus", () => {
    render(<DateInput label="Test Date" id="test-date" />);
    const input = screen.getByPlaceholderText("Select Test Date");
    fireEvent.focus(input);
    expect(input).toHaveAttribute("type", "date");
  });

  it("reverts input type to text on blur", () => {
    render(<DateInput label="Test Date" id="test-date" />);
    const input = screen.getByPlaceholderText("Select Test Date");
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(input).toHaveAttribute("type", "text");
  });
});

// TextInput Tests
describe("TextInput", () => {
  it("renders label and input with placeholder", () => {
    render(
      <TextInput label="Test Text" id="test-text" placeholder="Enter text" />,
    );
    expect(screen.getByLabelText("Test Text")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });
});

// FormContainer Tests
describe("FormContainer", () => {
  it("renders title and children within a form", () => {
    render(
      <FormContainer title="Test Form">
        <div>Child Component</div>
      </FormContainer>,
    );
    expect(screen.getByText("Test Form")).toBeInTheDocument();
    expect(screen.getByText("Child Component")).toBeInTheDocument();
    expect(screen.getByRole("form")).toBeInTheDocument();
  });
});
