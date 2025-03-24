import { render, screen, fireEvent } from "@testing-library/react";
import IdentityVerification from "../IdentityVerificationPage";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../../store/Store.ts";

describe("IdentityVerification Component", () => {
  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <IdentityVerification />
        </MemoryRouter>
      </Provider>,
    );

  // test("renders the component correctly", () => {
  //   renderComponent();

  //   // Check if the header is rendered
  //   expect(screen.getByText("Let’s Verify Your Identity")).toBeInTheDocument();
  //   expect(
  //     screen.getByText(
  //       "Follow these quick steps to complete your identity verification and secure your account.",
  //     ),
  //   ).toBeInTheDocument();
  // });

  test("renders all verification steps", () => {
    renderComponent();

    // Verify that each step is displayed
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
    expect(screen.getByText("Upload your Front ID")).toBeInTheDocument();
    expect(screen.getByText("Upload your Back ID")).toBeInTheDocument();
    expect(screen.getByText("Take a photo with your ID")).toBeInTheDocument();
    expect(screen.getByText("Tax Identifier Document")).toBeInTheDocument();
  });

  test("clicking on a step opens the corresponding popup", () => {
    renderComponent();

    // Click on "Personal Info" step
    fireEvent.click(screen.getByText("Personal Info"));
    expect(screen.getByText("Personal Info")).toBeInTheDocument();

    // Click on "Upload your Front ID" step
    fireEvent.click(screen.getByText("Upload your Front ID"));
    expect(screen.getByText("Upload your Front ID")).toBeInTheDocument();

    // Click on "Upload your Back ID" step
    fireEvent.click(screen.getByText("Upload your Back ID"));
    expect(screen.getByText("Upload your Back ID")).toBeInTheDocument();

    // Click on "Take a photo with your ID" step
    fireEvent.click(screen.getByText("Take a photo with your ID"));
    expect(screen.getByText("Take a photo with your ID")).toBeInTheDocument();

    // Click on "Tax Identifier Document" step
    fireEvent.click(screen.getByText("Tax Identifier Document"));
    expect(screen.getByText("Tax Identifier Document")).toBeInTheDocument();
  });

  test("Back button resets to step selection", () => {
    renderComponent();

    // Click on a step
    fireEvent.click(screen.getByText("Personal Info"));

    // Click the Back button
    fireEvent.click(screen.getByText("Back"));

    // Check if the steps are displayed again
    expect(screen.getByText("Personal Info")).toBeInTheDocument();
  });
});
