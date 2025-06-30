// import { render, screen } from "@testing-library/react";
// import EmailCode from "../emailCode";
// import "@testing-library/jest-dom";
// import { vi, test, expect, beforeEach } from "vitest";
// import { Provider } from "react-redux";
// import { configureStore } from "@reduxjs/toolkit";

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
//     useLocation: () => ({
//       state: {
//         email: "test@example.com",
//         accountCert: "test-cert",
//       },
//     }),
//   };
// });

// // Mock react-redux
// vi.mock("react-redux", () => ({
//   ...vi.importActual("react-redux"),
//   useDispatch: vi.fn(),
//   useSelector: vi.fn((selector) =>
//     selector({
//       account: {
//         accountId: "test-account-id",
//         accountCert: "test-cert",
//       },
//     }),
//   ),
// }));

// // Mock sonner toast
// vi.mock("sonner", () => ({
//   toast: {
//     error: vi.fn(),
//     success: vi.fn(),
//   },
// }));

// // Mock the verification service
// vi.mock("@services/keyManagement/requestService", () => ({
//   RequestToVerifyEmailCode: vi.fn(() => Promise.resolve({ success: true })),
// }));

// const renderComponent = () => {
//   return render(
//     <Provider store={mockStore}>
//       <EmailCode />
//     </Provider>
//   );
// };

// describe("EmailCode Component", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   test("renders OTP inputs and buttons", () => {
//     renderComponent();
//     expect(screen.getAllByRole("textbox")).toHaveLength(6);
//     expect(screen.getByText("Verify")).toBeInTheDocument();
//     expect(screen.getByText("Back")).toBeInTheDocument();
//   });
// });
