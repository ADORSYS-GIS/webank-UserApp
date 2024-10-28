import React, { useMemo } from "react";
import { RE_DIGIT } from "../constants";

export type Props = {
  value: string;
  valueLength: number;
  onChange: (value: string) => void;
};

export default function OtpInput({ value, valueLength, onChange }: Props) {
  const valueItems = useMemo(() => {
    const valueArray = value.split("");
    const items: Array<string> = [];
    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i];
      items.push(RE_DIGIT.test(char) ? char : "");
    }
    return items;
  }, [value, valueLength]);

  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null;
    if (nextElementSibling) nextElementSibling.focus();
  };

  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null;
    if (previousElementSibling) previousElementSibling.focus();
  };

  const handleOTPInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const target = e.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue);
    if (!isTargetValueDigit && targetValue !== "") return;

    targetValue = isTargetValueDigit ? targetValue : " ";
    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newValue =
        value.substring(0, idx) + targetValue + value.substring(idx + 1);
      onChange(newValue);
      if (isTargetValueDigit) focusToNextInput(target);
    } else if (targetValueLength === valueLength) {
      onChange(targetValue);
      target.blur();
    }
  };

  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;
    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      return focusToNextInput(target);
    }
    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      return focusToPrevInput(target);
    }
    const targetValue = target.value;
    target.setSelectionRange(0, targetValue.length);
    if (e.key === "Backspace" && targetValue === "") focusToPrevInput(target);
  };

  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;
    const prevInputEl =
      target.previousElementSibling as HTMLInputElement | null;
    if (prevInputEl && prevInputEl.value === "") prevInputEl.focus();
    target.setSelectionRange(0, target.value.length);
  };

  return (
    <div className="max-w-md  bg-white px-4 sm:px-8 py-10 ">
      <header className="mb-8 ">
        <h1 className="text-3xl font-bold mb-2">OTP Verification</h1>
        <p className="text-[15px]">
          Enter the 4-digit verification code that was sent to your phone
          number.
        </p>
      </header>
      <form className="flex items-center justify-center gap-3">
        {valueItems.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{1}"
            maxLength={1}
            className="w-14 h-17 text-center text-2xl font-extrabold text-slate-900 bg-white border border-slate-300 hover:border-slate-400 appearance-none rounded-lg p-5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            value={digit}
            onChange={(e) => handleOTPInputChange(e, idx)}
            onKeyDown={inputOnKeyDown}
            onFocus={inputOnFocus}
          />
        ))}
      </form>

      {/* <div className="text-sm text-slate-500 mt-4">
        Didn't receive code? <a className="font-medium text-indigo-500 hover:text-indigo-600" href="#0">Resend</a>
      </div> */}
    </div>
  );
}
