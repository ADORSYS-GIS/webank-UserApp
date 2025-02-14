// Sidebar.test.tsx
import { render, screen } from "@testing-library/react";
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
