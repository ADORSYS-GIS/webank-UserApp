import React, { useMemo } from "react";
import { RE_DIGIT } from "../constants";
import "./OtpInput.css";
export type Props = {
  value: string;
  valueLength: number;
  // Callback to handle changes in OTP value
  onChange: (value: string) => void;
};

export default function OtpInput({ value, valueLength, onChange }: Props) {
  // Memoize the array of input values based on the current OTP value and length
  const valueItems = useMemo(() => {
    const valueArray = value.split("");
    const items: Array<string> = [];

    // Loop through each input position
    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i];

      // If the character matches a digit, use it, otherwise use an empty string
      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push("");
      }
    }

    return items;
  }, [value, valueLength]);

  // Function to focus on the next input field
  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null;

    // Focus on the next input field if it exists
    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };

  // Function to focus on the previous input field
  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null;

    // Focus on the previous input field if it exists
    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };

  // Event handler when the user changes input value
  const handleOTPInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const target = e.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue); // Check if it's a valid digit

    // If it's not a digit and not empty, do nothing
    if (!isTargetValueDigit && targetValue !== "") {
      return;
    }

    const nextInputEl = target.nextElementSibling as HTMLInputElement | null;

    // If the next input has a value, don't delete the current one
    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== "") {
      return;
    }

    // If input is invalid or empty, set a space (clears the value)
    targetValue = isTargetValueDigit ? targetValue : " ";

    const targetValueLength = targetValue.length;

    // If input length is 1, update the OTP value
    if (targetValueLength === 1) {
      const newValue =
        value.substring(0, idx) + targetValue + value.substring(idx + 1);

      onChange(newValue);

      // Focus to the next input field if a valid digit was entered
      if (!isTargetValueDigit) {
        return;
      }

      focusToNextInput(target);
    } else if (targetValueLength === valueLength) {
      // If all digits are entered, update the entire value and blur the input
      onChange(targetValue);
      target.blur();
    }
  };

  // Event handler for keydown events in the input fields
  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;

    // Handle arrow key navigation
    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      return focusToNextInput(target);
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      return focusToPrevInput(target);
    }

    const targetValue = target.value;

    // Select the entire input value if the same digit is typed
    target.setSelectionRange(0, targetValue.length);

    // If the Backspace key is pressed and the current input is empty, move to the previous input
    if (e.key !== "Backspace" || targetValue !== "") {
      return;
    }

    focusToPrevInput(target);
  };

  // Event handler for when the input field gains focus
  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;

    // Keep focusing back until the previous input has a value
    const prevInputEl =
      target.previousElementSibling as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === "") {
      return prevInputEl.focus();
    }

    // Select the entire input value on focus
    target.setSelectionRange(0, target.value.length);
  };

  // Render the OTP input fields
  return (
    <div>
      {valueItems.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}" // Regex pattern to allow only one digit
          maxLength={valueLength}
          className="otp-input"
          value={digit} // Current value of the input field
          onChange={(e) => handleOTPInputChange(e, idx)} // Handle input change
          onKeyDown={inputOnKeyDown} // Handle key press events
          onFocus={inputOnFocus} // Handle input focus
        />
      ))}
    </div>
  );
}
