// import { render, screen, fireEvent, waitFor } from "@testing-library/react";
// import InputEmail from "../emailVerification";
// import "@testing-library/jest-dom";
// import { vi } from "vitest";

// // Create a mock store with account state
// const mockStore = configureStore({
//   reducer: {
//     account: (
//       state = {
//         accountId: "test-account-id",
//         accountCert: "test-cert",
//       },
//     ) => state,
//   },
// });

// // Mock useNavigate
// const mockNavigate = vi.fn();
// vi.mock("@tanstack/react-router", async () => {
//   const actual = await vi.importActual("@tanstack/react-router");
//   return {
//     ...actual,
//     useNavigate: () => mockNavigate,
//   };
// });

// // Mock for OpenAPI email mutation
// const mockEmailMutation = vi.fn();
// vi.mock("@openapi/generated/prs/queries/queries", () => ({
//   useEmailOtpServicePostApiPrsEmailOtpSend: () => ({
//     mutateAsync: mockEmailMutation,
//   }),
//   RequestToSendEmailOTP: vi.fn(() => Promise.resolve("OTP sent successfully")),
// }));

// vi.mock("@state/accountStore", () => ({
//   useAccountStore: vi.fn(() => ({
//     accountCert: "mockCert123",
//     accountId: "1",
//   })),
// }));

// const renderWithProviders = (
//   ui: React.ReactElement,
//   initialEntry = "/inputEmail",
// ) => {
//   return render(
//     <MemoryRouter initialEntries={[initialEntry]}>
//       <Routes>
//         <Route path="/inputEmail" element={ui} />
//         <Route path="/emailCode" element={<div>EmailCode Page</div>} />
//       </Routes>
//     </MemoryRouter>,
//   );
// };

//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("renders email input and proceed button", () => {
//     renderComponent();
//     expect(screen.getByPlaceholderText("name@example.com")).toBeInTheDocument();
//     expect(
//       screen.getByRole("button", { name: /Send Verification Code/i }),
//     ).toBeInTheDocument();
//   });

//   it("validates email format before submission", async () => {
//     renderComponent();
//     const emailInput = screen.getByPlaceholderText("name@example.com");
//     const proceedButton = screen.getByRole("button", {
//       name: /Send Verification Code/i,
//     });

//     // Test invalid email
//     fireEvent.change(emailInput, { target: { value: "invalid-email" } });
//     fireEvent.click(proceedButton);

//     await waitFor(() => {
//       expect(mockEmailMutation).toHaveBeenCalledWith({
//         requestBody: {
//           accountId: "1",
//           email: "name@example.com",
//         },
//       });
//       expect(navigateMock).toHaveBeenCalledWith("/emailCode", {
//         state: { email: "name@example.com", accountCert: "mockCert123" },
//       });
//     });
//   });

//   test("shows error toast for an invalid email", async () => {
//     renderWithProviders(<InputEmail />);
//     const emailInput = screen.getByPlaceholderText("name@example.com");
//     const proceedButton = screen.getByRole("button", {
//       name: /Send Verification Code/i,
//     });

//     // Enter valid email and submit
//     fireEvent.change(emailInput, { target: { value: "test@example.com" } });
//     fireEvent.click(proceedButton);

//     // Should call the API with correct parameters
//     await waitFor(() => {
//       expect(navigateMock).not.toHaveBeenCalled();
//       expect(mockEmailMutation).not.toHaveBeenCalled();
//     });
//   });

//   it("handles back button click", () => {
//     renderComponent();
//     const backButton = screen.getByRole("button", { name: /Go Back/i });
//     fireEvent.click(backButton);
//     expect(mockNavigate).toHaveBeenCalledWith({
//       to: "/settings",
//     });
//   });
// });
