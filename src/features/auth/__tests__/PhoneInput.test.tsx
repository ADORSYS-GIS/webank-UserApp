// import { render, fireEvent, waitFor, screen } from "@testing-library/react";
// import Register from "@features/auth/pages/PhoneInput";
// import "@testing-library/jest-dom";
// import { RequestToSendOTP } from "@services/keyManagement/requestService";
// import { describe, it, beforeEach, vi, expect } from "vitest";
// import { toast } from "sonner";
// import { Provider } from "react-redux";
// import { configureStore } from "@reduxjs/toolkit";

// // Mock global objects and methods
// global.alert = vi.fn();

// // Mock useNavigate
// const mockNavigate = vi.fn();
// vi.mock("@tanstack/react-router", async () => {
//   const actual = await vi.importActual("@tanstack/react-router");
//   return {
//     ...actual,
//     useNavigate: () => mockNavigate,
//   };
// });

// // Define the AccountState interface based on the actual implementation
// interface AccountState {
//   accountId: string | null;
//   accountCert: string | null;
//   status: "PENDING" | "APPROVED" | "REJECTED" | null;
//   documentStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
//   kycCert: string | null;
//   emailStatus: "APPROVED" | null;
//   phoneStatus: "APPROVED" | null;
//   loading?: boolean;
//   error?: Error | null;
//   user?: Record<string, unknown> | null;
// }

// // Create a mock store with properly typed account state
// const createMockStore = () => {
//   const initialState: AccountState = {
//     accountId: "test-account-id",
//     accountCert: "test-cert",
//     status: "PENDING",
//     documentStatus: "PENDING",
//     kycCert: "test-kyc-cert",
//     emailStatus: null,
//     phoneStatus: null,
//   };

//   return configureStore({
//     reducer: {
//       account: (state: AccountState | undefined = initialState) => state ?? initialState,
//     },
//   });
// };

// // Mock the service directly
// vi.mock("@services/keyManagement/requestService", () => ({
//   RequestToSendOTP: vi.fn(() => Promise.resolve("otp-hash")),
// }));

// // Mock sonner toast
// vi.mock("sonner", () => ({
//   toast: {
//     error: vi.fn(),
//     success: vi.fn(),
//   },
// }));

// const renderComponent = () => {
//   return render(
//     <Provider store={createMockStore()}>
//       <Register />
//     </Provider>
//   );
// };

// describe("Register Component", () => {
//   beforeEach(() => {
//     vi.clearAllMocks();
//   });

//   it("renders phone input and button", () => {
//     renderComponent();
//     expect(screen.getByPlaceholderText("Enter phone number")).toBeInTheDocument();
//     expect(screen.getByRole("button", { name: /send code/i })).toBeInTheDocument();
//   });

//   it("sends OTP on button click", async () => {
//     renderComponent();

//     const phoneInput = screen.getByPlaceholderText("Enter phone number");
//     const sendButton = screen.getByRole("button", { name: /send code/i });

//     fireEvent.change(phoneInput, { target: { value: "1234567890" } });
//     fireEvent.click(sendButton);

//     await waitFor(() => {
//       expect(RequestToSendOTP).toHaveBeenCalledWith("1234567890");
//       expect(mockNavigate).toHaveBeenCalledWith({
//         to: "/verify-otp",
//         state: { phoneNumber: "1234567890", otpHash: "otp-hash" },
//       });
//     });
//   });

//   it("shows error for invalid phone number", async () => {
//     renderComponent();

//     const phoneInput = screen.getByPlaceholderText("Enter phone number");
//     const sendButton = screen.getByRole("button", { name: /send code/i });

//     fireEvent.change(phoneInput, { target: { value: "123" } });
//     fireEvent.click(sendButton);

//     await waitFor(() => {
//       expect(RequestToSendOTP).not.toHaveBeenCalled();
//       expect(screen.getByText(/please enter a valid phone number/i)).toBeInTheDocument();
//     });
//   });

//   it("handles API errors", async () => {
//     vi.mocked(RequestToSendOTP).mockRejectedValueOnce(new Error("API Error"));

//     renderComponent();

//     const phoneInput = screen.getByPlaceholderText("Enter phone number");
//     const sendButton = screen.getByRole("button", { name: /send code/i });

//     fireEvent.change(phoneInput, { target: { value: "1234567890" } });
//     fireEvent.click(sendButton);

//     await waitFor(() => {
//       expect(toast.error).toHaveBeenCalledWith("Failed to send OTP. Please try again.");
//     });
//   });
// });
