// import { render, screen } from "@testing-library/react";
// import LocationComponent from "../../components/LocationComponent";
// import { useNavigate } from "react-router-dom";
// import "@testing-library/jest-dom";
// import { vi } from "vitest";

// vi.mock("@state/accountStore", () => ({
//   useAccountStore: vi.fn(() => ({
//     accountCert: "test-cert",
//   })),
// }));

// vi.mock("react-router-dom", () => ({
//   useNavigate: vi.fn(),
// }));

// describe("LocationComponent - Basic Rendering", () => {
//   beforeEach(() => {
//     // Mock navigation
//     (useNavigate as jest.Mock).mockReturnValue(vi.fn());
//     // Mock geolocation
//     Object.defineProperty(global.navigator, "geolocation", {
//       value: {
//         getCurrentPosition: vi.fn(),
//         watchPosition: vi.fn(),
//         clearWatch: vi.fn(),
//       },
//       configurable: true,
//     });
//   });

//   it("renders all text elements correctly", () => {
//     render(
//         <LocationComponent />
//     );

//     expect(screen.getByText("Location Verification")).toBeInTheDocument();
//     expect(
//       screen.getByText(/primary residence\? We need to verify/i),
//     ).toBeInTheDocument();
//     expect(
//       screen.getByText("Continue with KYC Verification"),
//     ).toBeInTheDocument();
//     expect(screen.getByText("Cancel")).toBeInTheDocument();
//     expect(
//       screen.queryByText("Location access denied"),
//     ).not.toBeInTheDocument();
//   });
// });
