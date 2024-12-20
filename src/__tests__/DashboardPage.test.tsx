import { render, screen } from "@testing-library/react";
import CurrentAccount from "../pages/DashboardPage";
import "@testing-library/jest-dom";

describe("YourComponent", () => {
  it("should handle text elements correctly", () => {
    render(<CurrentAccount />);

    // Find the text elements using their content (adjust the texts as needed)
    const textElement1 = screen.getByText("Current Account");
    const textElement3 = screen.getByText("1,000 XAF");
    const textElement4 = screen.getByText("History");

    // Assert that the text elements exist and handle them accordingly
    expect(textElement1).toBeInTheDocument();
    expect(textElement3).toBeInTheDocument();
    expect(textElement4).toBeInTheDocument();

    // You can add more assertions or logic here to handle the text elements
    // based on their existence or content
  });
});
