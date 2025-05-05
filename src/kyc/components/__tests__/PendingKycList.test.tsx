import { render, screen, fireEvent } from "@testing-library/react";
import { PendingKycList } from "../PendingKycList";
import { UserKYC } from "../../types/types";
import "@testing-library/jest-dom";

describe("PendingKycList", () => {
  const mockUsers: UserKYC[] = [
    {
      id: "1",
      accountId: "user1",
      docNumber: "DOC123",
      expirationDate: "2025-12-31",
      location: "New York",
      email: "user1@example.com",
      status: "PENDING",
      frontID: "front1.jpg",
      backID: "back1.jpg",
      selfie: "selfie1.jpg",
      taxDocument: "tax1.pdf",
    },
    {
      id: "2",
      accountId: "user2",
      docNumber: "DOC456",
      expirationDate: "2025-12-31",
      location: "Los Angeles",
      email: "user2@example.com",
      status: "PENDING",
      frontID: "front2.jpg",
      backID: "back2.jpg",
      selfie: "selfie2.jpg",
      taxDocument: "tax2.pdf",
    },
  ];

  const defaultProps = {
    users: mockUsers,
    loading: false,
    onSelectUser: vi.fn(),
  };

  it("renders loading state", () => {
    render(<PendingKycList {...defaultProps} loading={true} />);
    expect(screen.getByText("Loading pending requests...")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(<PendingKycList {...defaultProps} users={[]} />);
    expect(screen.getByText("No pending verifications")).toBeInTheDocument();
  });

  it("renders list of users", () => {
    render(<PendingKycList {...defaultProps} />);

    expect(screen.getByText("AccountId: user1")).toBeInTheDocument();
    expect(screen.getByText("AccountId: user2")).toBeInTheDocument();
    expect(screen.getAllByText("Review")).toHaveLength(2);
  });

  it("calls onSelectUser when Review button is clicked", () => {
    render(<PendingKycList {...defaultProps} />);

    const reviewButtons = screen.getAllByText("Review");
    fireEvent.click(reviewButtons[0]);

    expect(defaultProps.onSelectUser).toHaveBeenCalledWith(mockUsers[0]);
  });

  it("applies correct styling classes", () => {
    render(<PendingKycList {...defaultProps} />);

    const userContainer =
      screen.getByText("AccountId: user1").parentElement?.parentElement;
    expect(userContainer).toHaveClass(
      "flex",
      "justify-between",
      "items-center",
      "p-4",
      "border",
      "rounded-lg",
      "hover:bg-gray-50",
      "transition-colors",
    );

    const reviewButton = screen.getAllByText("Review")[0];
    expect(reviewButton).toHaveClass(
      "px-4",
      "py-2",
      "bg-blue-600",
      "text-white",
      "rounded-full",
      "hover:bg-blue-700",
      "transition-colors",
    );
  });
});
