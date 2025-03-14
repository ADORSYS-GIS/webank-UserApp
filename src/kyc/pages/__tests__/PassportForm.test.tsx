// PassportForm.test.tsx
import { describe, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PassportForm from "../PassportForm";
import "@testing-library/jest-dom/vitest";

describe("PassportForm", () => {
  it("renders all form elements", () => {
    render(<PassportForm />);

    // Check form title
    expect(screen.getByText("Passport Information")).toBeInTheDocument();

    // Check select components
    expect(screen.getByText("Select Passport Type")).toBeInTheDocument();
    expect(screen.getByText("Select Region")).toBeInTheDocument();

    // Check text inputs
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Profession")).toBeInTheDocument();
    expect(screen.getByLabelText("Passport Number")).toBeInTheDocument();

    // Check date inputs
    expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();
    expect(screen.getByLabelText("Expiration Date")).toBeInTheDocument();

    // Check submit button
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("selects passport type and region", () => {
    render(<PassportForm />);

    // Select passport type
    fireEvent.click(screen.getByText("Select Passport Type"));
    fireEvent.click(screen.getByText("Diplomatic Passport"));
    expect(screen.getByText("Diplomatic Passport")).toBeInTheDocument();

    // Select region
    fireEvent.click(screen.getByText("Select Region"));
    fireEvent.click(screen.getByText("West"));
    expect(screen.getByText("West")).toBeInTheDocument();
  });
});
