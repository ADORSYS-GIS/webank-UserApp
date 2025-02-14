// Sidebar.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import "@testing-library/jest-dom/vitest";
import Sidebar from "../../components/SideBar.tsx"; // Import jest-dom matchers

describe("Sidebar", () => {
  it("renders the sidebar with navigation links", () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>,
    );

    // Check if the sidebar title is rendered
    expect(screen.getByText("Webank Portal")).toBeInTheDocument();

    // Check if navigation links are rendered
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Agent Services")).toBeInTheDocument();
  });
});

it("navigates to the correct page when a link is clicked", () => {
  render(
    <BrowserRouter>
      <Sidebar />
    </BrowserRouter>,
  );

  // Click on the 'Agent Services' link
  fireEvent.click(screen.getByText("Agent Services"));

  // Check if the URL has changed to '/agent'
  expect(window.location.pathname).toBe("/agent");
});
