import { render, screen } from "@testing-library/react";
import CurrentAccountComponent from './CurrentAccountComponent'; // Replace with your component name

describe('CurrentAccountComponent', () => {
    it('renders the component correctly', () => {
        render(<CurrentAccountComponent />);

        // Assertions to check if the component's elements are rendered as expected
        expect(screen.getByText('Current Account')).toBeInTheDocument();
        expect(screen.getByText('CM-******1215')).toBeInTheDocument();
        expect(screen.getByText('1,000 XAF')).toBeInTheDocument();
        expect(screen.getByText('History')).toBeInTheDocument();
    });

    // Add more test cases to cover specific functionality, interactions, and edge cases
});