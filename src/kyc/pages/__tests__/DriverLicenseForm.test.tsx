// DriverLicenseForm.test.tsx
import { describe, it, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../../store/Store.ts";
import DriverLicenseForm from "../DriverLicenseForm";
import "@testing-library/jest-dom/vitest";

// Mock the alert function
window.alert = vi.fn();

describe("DriverLicenseForm", () => {

  beforeEach(() => {
    indexedDB.deleteDatabase("yourDBName");
  });

  const renderForm = () =>
    render(
      <Provider store={store}>
        <DriverLicenseForm />
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
  });

  it("opens and selects region", () => {
    renderForm();

    // Open region selector
    fireEvent.click(screen.getByText("Select Region"));

    // Select "West" region
    fireEvent.click(screen.getByText("West"));

    // Verify selection
    expect(screen.getByText("West")).toBeInTheDocument();
  });
});
