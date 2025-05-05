import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ContactsPage from "../ContactsPage";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("../../components/ContactList", () => ({
  default: vi.fn(({ onSelectContact }) => (
    <div data-testid="contact-list">
      <button
        onClick={() =>
          onSelectContact({ accountId: "contact-123", name: "John Doe" })
        }
      >
        Select Contact
      </button>
    </div>
  )),
}));

const mockStore = configureStore({
  reducer: {
    account: () => ({
      accountId: "agent-123",
      accountCert: "agent-cert-456",
    }),
  },
});

describe("ContactsPage", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <ContactsPage />
        </MemoryRouter>
      </Provider>,
    );
  };

  it("renders the contacts page title", () => {
    renderComponent();
    expect(screen.getByText("My Contacts")).toBeInTheDocument();
  });

  it("renders the ContactList component", () => {
    renderComponent();
    expect(screen.getByTestId("contact-list")).toBeInTheDocument();
  });

  it("navigates to top-up page with correct state when contact is selected", () => {
    renderComponent();

    const selectButton = screen.getByText("Select Contact");
    fireEvent.click(selectButton);

    expect(mockNavigate).toHaveBeenCalledWith("/top-up", {
      state: {
        agentAccountId: "agent-123",
        agentAccountCert: "agent-cert-456",
        clientAccountId: "contact-123",
        clientName: "John Doe",
        fromContacts: true,
        show: "Payment",
      },
    });
  });
});
