// DriverLicenseForm.test.tsx
import { describe, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DriverLicenseForm from "../DriverLicenseForm";
import "@testing-library/jest-dom/vitest";

describe("DriverLicenseForm", () => {
  it("renders all form elements", () => {
    render(<DriverLicenseForm />);

    // Check form title
    expect(screen.getByText("Driver License Information")).toBeInTheDocument();

    // Check text inputs
    expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Profession")).toBeInTheDocument();
    expect(screen.getByLabelText("Driver License Number")).toBeInTheDocument();

    // Check date inputs
    expect(screen.getByLabelText("Date of Birth")).toBeInTheDocument();
    expect(screen.getByLabelText("Expiration Date")).toBeInTheDocument();

    // Check region selector
    expect(screen.getByText("Select Region")).toBeInTheDocument();

    // Check submit button
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("opens and selects region", () => {
    render(<DriverLicenseForm />);

    // Open region selector
    fireEvent.click(screen.getByText("Select Region"));

    // Select "West" region
    fireEvent.click(screen.getByText("West"));

    // Verify selection
    expect(screen.getByText("West")).toBeInTheDocument();
  });
});
