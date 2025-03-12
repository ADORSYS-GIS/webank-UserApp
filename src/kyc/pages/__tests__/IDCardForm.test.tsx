// IDCardForm.test.tsx
import { describe, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import IDCardForm from "../IDCardForm";
import "@testing-library/jest-dom/vitest";

describe("IDCardForm", () => {
  it("renders all form elements", () => {
    render(<IDCardForm />);

    // Check form title
    expect(screen.getByText("ID Card Information")).toBeInTheDocument();

    // Check select components
    expect(screen.getByText("Select ID Type")).toBeInTheDocument();
    expect(screen.getByText("Select Region")).toBeInTheDocument();

    // Check text inputs
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Profession")).toBeInTheDocument();
    expect(screen.getByLabelText("ID Card Number")).toBeInTheDocument();

    // Check date inputs
    expect(screen.getByLabelText("Date Of Birth")).toBeInTheDocument();
    expect(screen.getByLabelText("Expiry Date")).toBeInTheDocument();

    // Check submit button
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("selects ID type and region", () => {
    render(<IDCardForm />);

    // Select ID type
    fireEvent.click(screen.getByText("Select ID Type"));
    fireEvent.click(screen.getByText("Receipt ID"));
    expect(screen.getByText("Receipt ID")).toBeInTheDocument();

    // Select region
    fireEvent.click(screen.getByText("Select Region"));
    fireEvent.click(screen.getByText("West"));
    expect(screen.getByText("West")).toBeInTheDocument();
  });
});
