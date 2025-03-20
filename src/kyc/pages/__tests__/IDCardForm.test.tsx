// IDCardForm.test.tsx
import { describe, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../store/Store.ts";
import IDCardForm from "../IDCardForm";
import "@testing-library/jest-dom/vitest";

// Mock the alert function
window.alert = vi.fn();

describe("IDCardForm", () => {

  beforeEach(() => {
    indexedDB.deleteDatabase("yourDBName");
  });

  const renderForm = () =>
    render(
      <Provider store={store}>
        <IDCardForm />
      </Provider>,
    );

  beforeEach(() => {
    (window.alert as jest.Mock).mockClear();
  });

  it("renders all form elements", () => {
    renderForm();

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
  });

  it("selects ID type and region", () => {
    renderForm();

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
