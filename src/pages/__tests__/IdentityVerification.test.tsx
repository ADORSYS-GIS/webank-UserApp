import { render, screen, fireEvent } from "@testing-library/react";
import IdentityVerification from "../IdentityVerificationPage";
import "@testing-library/jest-dom";

describe("IdentityVerification Component", () => {
  test("renders the component correctly", () => {
    render(<IdentityVerification />);

    // Check if the header is rendered
    expect(screen.getByText("Let’s Verify Your Identity")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Follow these quick steps to complete your identity verification and secure your account.",
      ),
    ).toBeInTheDocument();
  });

  test("renders all verification steps", () => {
    render(<IdentityVerification />);

    // Verify that each step is displayed
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
    expect(screen.getByText("Upload your Front ID")).toBeInTheDocument();
    expect(screen.getByText("Upload your Back ID")).toBeInTheDocument();
    expect(screen.getByText("Take a photo with your ID")).toBeInTheDocument();
  });

  test("clicking on a step updates the current step", () => {
    render(<IdentityVerification />);

    const personalInfoStep = screen.getByText("Personal Info");

    // Click on "Personal Info" step
    fireEvent.click(personalInfoStep);

    // Check if the step content is displayed
    expect(screen.getByText("Personal Information")).toBeInTheDocument();
  });

  test("Back button resets to step selection", () => {
    render(<IdentityVerification />);

    // Click on a step
    fireEvent.click(screen.getByText("Personal Info"));

    // Click the Back button
    fireEvent.click(screen.getByText("Back"));

    // Check if the steps are displayed again
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
  });
});
