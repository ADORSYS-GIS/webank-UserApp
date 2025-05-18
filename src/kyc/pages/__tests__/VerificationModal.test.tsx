// VerificationModal.test.tsx
import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router';
import { beforeEach, describe, it, vi } from 'vitest';

import VerificationModal from '../../components/VerificationModal';

// Mock react-router navigation
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('VerificationModal', () => {
  const onCloseMock = vi.fn();
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('renders modal with title and verification options', () => {
    render(
      <MemoryRouter>
        <VerificationModal onClose={onCloseMock} />
      </MemoryRouter>,
    );

    expect(screen.getByText('ID CARD')).toBeInTheDocument();
    expect(screen.getByText('PASSPORT')).toBeInTheDocument();
    expect(screen.getByText('DRIVING LICENSE')).toBeInTheDocument();
  });

  it('closes modal when clicking close button', () => {
    render(
      <MemoryRouter>
        <VerificationModal onClose={onCloseMock} />
      </MemoryRouter>,
    );

    // Simulate a click on the close button
    fireEvent.click(screen.getByText('×'));

    // Assert that the onCloseMock function was called
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it('navigates to ID card verification on click', () => {
    render(
      <MemoryRouter>
        <VerificationModal onClose={onCloseMock} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('ID CARD'));
    expect(mockNavigate).toHaveBeenCalledWith('/verification/id-card');
  });

  it('navigates to passport verification on click', () => {
    render(
      <MemoryRouter>
        <VerificationModal onClose={onCloseMock} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('PASSPORT'));
    expect(mockNavigate).toHaveBeenCalledWith('/verification/passport');
  });

  it('navigates to driving license verification on click', () => {
    render(
      <MemoryRouter>
        <VerificationModal onClose={onCloseMock} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText('DRIVING LICENSE'));
    expect(mockNavigate).toHaveBeenCalledWith('/verification/driving-license');
  });
});
