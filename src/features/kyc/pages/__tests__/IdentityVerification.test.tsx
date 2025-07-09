// import { render, screen, fireEvent } from "@testing-library/react";
// import IdentityVerification from "../IdentityVerificationPage";
// import "@testing-library/jest-dom";
// import { vi } from "vitest";

// // Mock the Zustand store
// vi.mock("@state/accountStore", () => ({
//   useAccountStore: vi.fn(() => ({
//     accountId: "1",
//     accountCert: "mockCert123",
//     status: "PENDING",
//     documentStatus: null,
//     setStatus: vi.fn(),
//     setDocumentStatus: vi.fn(),
//   })),
// }));

// describe("IdentityVerification Component", () => {
//   const renderComponent = () => render(<IdentityVerification />);

//   beforeEach(() => {
//     // Clear all mocks before each test
//     vi.clearAllMocks();
//   });

//   test("renders all verification steps", () => {
//     renderComponent();
//     expect(screen.getByText("Personal Info")).toBeInTheDocument();
//   });

//   test("clicking on a step opens the corresponding popup", () => {
//     renderComponent();
//     fireEvent.click(screen.getByText("Personal Info"));
//     expect(screen.getByText("Personal Info")).toBeInTheDocument();
//   });

//   test("Back button resets to step selection", () => {
//     renderComponent();
//     fireEvent.click(screen.getByText("Personal Info"));
//     fireEvent.click(screen.getByText("Back"));
//     expect(screen.getByText("Personal Info")).toBeInTheDocument();
//   });
// });
