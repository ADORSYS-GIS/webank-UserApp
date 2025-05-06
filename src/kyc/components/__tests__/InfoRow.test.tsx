import { render, screen } from "@testing-library/react";
import { InfoRow } from "../InfoRow";
import { FiUser } from "react-icons/fi";
import "@testing-library/jest-dom";

describe("InfoRow", () => {
  const defaultProps = {
    icon: <FiUser />,
    label: "Test Label",
    value: "Test Value",
  };

  it("renders with all props", () => {
    render(<InfoRow {...defaultProps} />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("Test Value")).toBeInTheDocument();
  });

  it("renders with N/A when value is empty", () => {
    render(<InfoRow {...defaultProps} value="" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders with custom icon", () => {
    const customIcon = <span data-testid="custom-icon">Custom Icon</span>;
    render(<InfoRow {...defaultProps} icon={customIcon} />);

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("applies correct styling classes", () => {
    render(<InfoRow {...defaultProps} />);

    const container =
      screen.getByText("Test Label").parentElement?.parentElement;
    expect(container).toHaveClass(
      "flex",
      "justify-between",
      "items-center",
      "py-2",
      "border-b",
      "border-gray-100",
    );

    const label = screen.getByText("Test Label");
    expect(label).toHaveClass("text-sm", "text-gray-600");

    const value = screen.getByText("Test Value");
    expect(value).toHaveClass("text-sm", "font-medium", "text-gray-900");
  });
});
