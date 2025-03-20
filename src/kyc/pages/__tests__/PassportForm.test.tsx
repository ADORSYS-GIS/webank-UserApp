import { describe, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../store/Store.ts";
import PassportForm from "../PassportForm";
import "@testing-library/jest-dom/vitest";

// Mock the alert function
window.alert = vi.fn();

describe("PassportForm", () => {

  beforeEach(() => {
    indexedDB.deleteDatabase("yourDBName");
  });

  const renderForm = () =>
    render(
      <Provider store={store}>
        <PassportForm />
      </Provider>,
    );

  beforeEach(async () => {
    (window.alert as jest.Mock).mockClear();
    // Clear IndexedDB before each test
    indexedDB.deleteDatabase("your-database-name");
  });

  it("renders all form elements", () => {
    renderForm();

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
  });

  it("selects passport type and region", () => {
    renderForm();

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
