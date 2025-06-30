// import { vi, describe, it, expect, beforeEach } from "vitest";
// import { render, screen, act } from "@testing-library/react";
// import Dashboard from "../DashboardPage";
// import "@testing-library/jest-dom";

// // Import the actual functions first
// import {
//   RequestToGetBalance as OriginalRequestToGetBalance,
//   RequestToGetTransactionHistory as OriginalRequestToGetTransactionHistory
// } from '@services/keyManagement/requestService';

// // Mock the API module
// vi.mock('@services/keyManagement/requestService', () => ({
//   RequestToGetBalance: vi.fn(),
//   RequestToGetTransactionHistory: vi.fn()
// }));

// // Import the mocked functions
// import {
//   RequestToGetBalance,
//   RequestToGetTransactionHistory
// } from '@services/keyManagement/requestService';

// // Type assertions for the mocks
// const mockRequestToGetBalance = RequestToGetBalance as jest.Mock<ReturnType<typeof OriginalRequestToGetBalance>, Parameters<typeof OriginalRequestToGetBalance>>;
// const mockRequestToGetTransactionHistory = RequestToGetTransactionHistory as jest.Mock<ReturnType<typeof OriginalRequestToGetTransactionHistory>, Parameters<typeof OriginalRequestToGetTransactionHistory>>;

// // Mock the Redux store
// const mockUseSelector = vi.fn();
// const mockUseDispatch = vi.fn();

// vi.mock('react-redux', () => ({
//   useSelector: (selector: (state: unknown) => unknown) => mockUseSelector(selector),
//   useDispatch: () => mockUseDispatch,
// }));

// // Mock FontAwesome
// vi.mock("@fortawesome/react-fontawesome", () => ({
//   FontAwesomeIcon: () => <div>Icon</div>,
// }));

// // Mock TanStack Router
// vi.mock("@tanstack/react-router", () => ({
//   useNavigate: () => vi.fn(),
// }));

// // Mock components that might cause issues in tests
// vi.mock("@shared/components/Header1", () => ({
//   __esModule: true,
//   default: () => <div data-testid="header">Header</div>,
// }));

// vi.mock("@shared/components/ActionButtons", () => ({
//   __esModule: true,
//   default: () => <div data-testid="action-buttons">Action Buttons</div>,
// }));

// vi.mock("@shared/components/BottomNavigation", () => ({
//   __esModule: true,
//   default: () => <div data-testid="bottom-navigation">Bottom Navigation</div>,
// }));

// vi.mock("@shared/components/SideBar", () => ({
//   __esModule: true,
//   default: ({ isOpen, children }: { isOpen: boolean; onClose?: () => void; children: React.ReactNode }) =>
//     isOpen ? <div data-testid="sidebar">{children}</div> : null,
// }));

// vi.mock("../components/BalanceCard", () => ({
//   __esModule: true,
//   default: () => <div data-testid="balance-card">Balance Card</div>,
// }));

// vi.mock("../components/TransactionsSection", () => ({
//   __esModule: true,
//   default: () => <div data-testid="transactions-section">Transactions Section</div>,
// }));

// describe("Dashboard", () => {
//   const renderDashboard = () => {
//     return render(<Dashboard />);
//   };

//   beforeEach(() => {
//     // Reset all mocks before each test
//     vi.clearAllMocks();

//     // Set up default mock implementations
//     mockRequestToGetBalance.mockResolvedValue(JSON.stringify({
//       status: 200,
//       data: { balance: 0, currency: 'XAF' }
//     }));

//     mockRequestToGetTransactionHistory.mockResolvedValue(JSON.stringify([
//       {
//         id: "1",
//         amount: 100,
//         type: "CREDIT",
//         date: new Date().toISOString(),
//         description: "Test transaction",
//       }
//     ]));

//     // Set up Redux mock
//     mockUseSelector.mockImplementation((selector) =>
//       selector({
//         account: {
//           accountId: 'test-account-id',
//           accountCert: 'test-cert',
//         },
//       })
//     );
//   });

//   it("renders the dashboard with all main components", async () => {
//     await act(async () => {
//       renderDashboard();
//     });

//     // Check if all main components are rendered
//     expect(screen.getByTestId("header")).toBeInTheDocument();
//     expect(screen.getByTestId("balance-card")).toBeInTheDocument();
//     expect(screen.getByTestId("action-buttons")).toBeInTheDocument();
//     expect(screen.getByTestId("bottom-navigation")).toBeInTheDocument();

//     // Verify API calls were made with correct arguments
//     expect(mockRequestToGetBalance).toHaveBeenCalledWith('test-account-id', 'test-cert');
//     expect(mockRequestToGetTransactionHistory).toHaveBeenCalledWith('test-account-id', 'test-cert');
//   });

//   it("loads and displays transactions", async () => {
//     await act(async () => {
//       renderDashboard();
//     });

//     // Verify API was called with correct parameters
//     expect(mockRequestToGetTransactionHistory).toHaveBeenCalledWith('test-account-id', 'test-cert');

//     // Verify transactions section is rendered
//     const transactionsSection = await screen.findByTestId('transactions-section');
//     expect(transactionsSection).toBeInTheDocument();
//   });
// });
