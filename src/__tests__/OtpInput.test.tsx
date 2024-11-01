import { fireEvent, render, screen } from "@testing-library/react";
import { faker } from "@faker-js/faker";
import OtpInput, { Props } from "../components/OtpInput.tsx";
import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";

describe("<OtpInput />", () => {
  // Function to render the OtpInput component with given props
  const renderComponent = (props: Props) => render(<OtpInput {...props} />);

  // Test case for validating value and valueLength props
  it("should accept value & valueLength props", () => {
    // Generate a random OTP value and split it into an array
    const value = faker.number.int({ min: 0, max: 999999 }).toString();
    const valueArray = value.split("");
    const valueLength = value.length;

    // Render the component with the generated value and length
    renderComponent({
      value,
      valueLength,
      onChange: vi.fn(),
    });

    // Query for all input elements
    const inputEls = screen.queryAllByRole("textbox");

    // Check if the number of input elements matches the valueLength
    expect(inputEls).toHaveLength(valueLength);

    // Validate each input element contains the corresponding value

    inputEls.forEach((inputEl, idx) => {
      expect(inputEl).toHaveValue(valueArray[idx]);
    });
  });

  // Test case for allowing typing of digits in the inputs

  it("should allow typing of digits", () => {
    // Generate a random length for the OTP input
    const valueLength = faker.number.int({ min: 2, max: 6 });
    const onChange = vi.fn();

    // Render the component with empty value
    renderComponent({
      valueLength,
      onChange,
      value: "",
    });

    // Query for input elements

    const inputEls = screen.queryAllByRole("textbox");

    // Verify the number of input elements

    expect(inputEls).toHaveLength(valueLength);

    // Loop through each input element

    inputEls.forEach((inputEl, idx) => {
      // Generate a random digit to simulate typing
      const digit = faker.number.int({ min: 0, max: 9 }).toString();

      // Simulate a change event on the input element
      fireEvent.change(inputEl, {
        target: { value: digit },
      });

      // Ensure the onChange function was called with the correct digit

      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toBeCalledWith(digit);

      // Determine which input should be focused next

      const inputFocused = inputEls[idx + 1] || inputEl;

      // Check if the next input is focused
      expect(inputFocused).toHaveFocus();

      // Reset the mock to avoid interference with the next iteration
      onChange.mockReset();
    });
  });

  // Test case for preventing non-digit inputs

  it("should NOT allow typing of non-digits", () => {
    const valueLength = faker.number.int({ min: 2, max: 6 });
    const onChange = vi.fn();

    // Render the component with empty value
    renderComponent({
      valueLength,
      onChange,
      value: "",
    });

    const inputEls = screen.queryAllByRole("textbox");

    expect(inputEls).toHaveLength(valueLength);

    // Loop through each input element
    inputEls.forEach((inputEl) => {
      // Generate a random non-digit character
      const nonDigit = faker.string.alpha(1);

      // Simulate typing a non-digit character
      fireEvent.change(inputEl, {
        target: { value: nonDigit },
      });

      // Ensure onChange was not called for non-digit input
      expect(onChange).not.toBeCalled();

      // Reset the mock for the next input
      onChange.mockReset();
    });
  });

  it("should allow deleting of digits (focus on previous element)", () => {
    // Generate a random numeric value and determine its length
    const value = faker.number.int({ min: 10, max: 999999 }).toString();
    const valueLength = value.length;
    const lastIdx = valueLength - 1; // Get the last index of the value
    const onChange = vi.fn(); // Mock the onChange function

    // Render the input component with the generated value
    renderComponent({
      value,
      valueLength,
      onChange,
    });

    const inputEls = screen.queryAllByRole("textbox"); // Query all input elements

    // Check if the number of input elements matches the value length
    expect(inputEls).toHaveLength(valueLength);

    // Loop through each input from the last to the first
    for (let idx = lastIdx; idx > -1; idx--) {
      const inputEl = inputEls[idx]; // Get the current input element
      const target = { value: "" }; // Prepare target for change event

      // Simulate a change event to clear the current input
      fireEvent.change(inputEl, { target });
      // Simulate pressing the Backspace key
      fireEvent.keyDown(inputEl, {
        target,
        key: "Backspace",
      });

      const valueArray = value.split(""); // Split the original value into an array
      valueArray[idx] = " "; // Replace the current digit with a space

      const expectedValue = valueArray.join(""); // Join the array to form the expected value

      // Verify that onChange was called correctly
      expect(onChange).toBeCalledTimes(1);
      expect(onChange).toBeCalledWith(expectedValue);

      // Determine which input should be focused after deletion
      const inputFocused = inputEls[idx - 1] || inputEl;

      // Check that the appropriate input is focused
      expect(inputFocused).toHaveFocus();

      // Reset the onChange mock for the next iteration
      onChange.mockReset();
    }
  });

  it("should allow deleting of digits (do NOT focus on previous element)", () => {
    // Generate a random numeric value and split it into an array
    const value = faker.number.int({ min: 10, max: 999999 }).toString();
    const valueArray = value.split("");
    const valueLength = value.length;
    const lastIdx = valueLength - 1;

    // Render the component with the generated value
    renderComponent({
      value,
      valueLength,
      onChange: vi.fn(), // Mock the onChange function
    });

    const inputEls = screen.queryAllByRole("textbox"); // Query input elements

    // Verify the number of input elements
    expect(inputEls).toHaveLength(valueLength);

    // Loop through each input from the last to the first
    for (let idx = lastIdx; idx > 0; idx--) {
      const inputEl = inputEls[idx]; // Get the current input element

      // Simulate pressing the Backspace key on the current input
      fireEvent.keyDown(inputEl, {
        key: "Backspace",
        target: { value: valueArray[idx] },
      });

      const prevInputEl = inputEls[idx - 1]; // Get the previous input element

      // Ensure the previous input does not gain focus
      expect(prevInputEl).not.toHaveFocus();
    }
  });

  it("should allow pasting of digits (same length as valueLength)", () => {
    // Generate a random numeric value and determine its length
    const value = faker.number.int({ min: 10, max: 999999 }).toString();
    const valueLength = value.length;
    const onChange = vi.fn(); // Mock the onChange function

    // Render the component with an empty initial value
    renderComponent({
      valueLength,
      onChange,
      value: "",
    });

    const inputEls = screen.queryAllByRole("textbox"); // Query input elements
    const randomIdx = faker.number.int({ min: 0, max: valueLength - 1 }); // Select a random index
    const randomInputEl = inputEls[randomIdx]; // Get the random input element

    // Simulate pasting the value into the selected input
    fireEvent.change(randomInputEl, { target: { value } });

    // Verify that onChange was called correctly with the pasted value
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(value);

    // Ensure the input does not have focus after pasting
    expect(randomInputEl).not.toHaveFocus();
  });

  it("should NOT allow pasting of digits (less than valueLength)", () => {
    // Generate a random numeric value and determine its length
    const value = faker.number.int({ min: 10, max: 99999 }).toString();
    const valueLength = faker.number.int({ min: 6, max: 10 }); // Set a random value length
    const onChange = vi.fn(); // Mock the onChange function

    // Render the component with an empty initial value
    renderComponent({
      valueLength,
      onChange,
      value: "",
    });

    const inputEls = screen.queryAllByRole("textbox"); // Query input elements
    const randomIdx = faker.number.int({ min: 0, max: valueLength - 1 }); // Select a random index
    const randomInputEl = inputEls[randomIdx]; // Get the random input element

    // Simulate pasting a shorter value into the selected input
    fireEvent.change(randomInputEl, { target: { value } });

    // Verify that onChange was NOT called since the pasted value is shorter
    expect(onChange).not.toBeCalled();
  });

  it("should focus to next element on right/down key", () => {
    // Render the component with a random numeric value
    renderComponent({
      value: faker.number.int({ min: 100, max: 999 }).toString(),
      valueLength: 3,
      onChange: vi.fn(), // Mock the onChange function
    });

    const inputEls = screen.queryAllByRole("textbox"); // Query input elements
    const firstInputEl = inputEls[0]; // Get the first input element

    // Simulate pressing the right arrow key
    fireEvent.keyDown(firstInputEl, { key: "ArrowRight" });

    const secondInputEl = inputEls[1]; // Get the second input element

    // Verify that the second input gains focus
    expect(secondInputEl).toHaveFocus();

    // Simulate pressing the down arrow key
    fireEvent.keyDown(secondInputEl, { key: "ArrowDown" });

    const thirdInputEl = inputEls[2]; // Get the third input element

    // Verify that the third input gains focus
    expect(thirdInputEl).toHaveFocus();
  });

  it("should focus to next element on left/up key", () => {
    // Render the component with a random numeric value
    renderComponent({
      value: faker.number.int({ min: 100, max: 999 }).toString(),
      valueLength: 3,
      onChange: vi.fn(), // Mock the onChange function
    });

    const inputEls = screen.queryAllByRole("textbox"); // Query input elements
    const thirdInputEl = inputEls[2]; // Get the third input element

    // Simulate pressing the left arrow key
    fireEvent.keyDown(thirdInputEl, { key: "ArrowLeft" });

    const secondInputEl = inputEls[1]; // Get the second input element

    // Verify that the second input gains focus
    expect(secondInputEl).toHaveFocus();

    // Simulate pressing the up arrow key
    fireEvent.keyDown(secondInputEl, { key: "ArrowUp" });

    const firstInputEl = inputEls[0]; // Get the first input element

    // Verify that the first input gains focus
    expect(firstInputEl).toHaveFocus();
  });
  // Test suite for handling focus behavior in a multi-input component
  it("should only focus to input if previous input has value", () => {
    // Set the expected number of input fields
    const valueLength = 6;

    // Render the component with the specified value length, an empty initial value, and a mock change handler
    renderComponent({
      valueLength, // Number of input fields
      value: "", // Initial value for the inputs (empty)
      onChange: vi.fn(), // Mock function to track changes
    });

    // Query all rendered input elements that are of the 'textbox' role
    const inputEls = screen.queryAllByRole("textbox");

    // Identify the last input element in the array of input elements
    const lastInputEl = inputEls[valueLength - 1];

    // Set focus on the last input element
    lastInputEl.focus();

    // Identify the first input element in the array of input elements
    const firstInputEl = inputEls[0];

    // Assert that the first input element has focus after focusing on the last input
    expect(firstInputEl).toHaveFocus();
  });
});
