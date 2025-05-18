import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { toast } from 'sonner';
import { vi } from 'vitest';
import { RequestToGetOtps } from '../../services/keyManagement/requestService';
import { Component as TellerDashboard } from '../TellerPage';

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}));

vi.mock('../../services/keyManagement/requestService', () => ({
  RequestToGetOtps: vi.fn(),
}));

const mockStore = configureStore();
const mockData = [
  { phoneNumber: '1234567890', otpCode: '123456', status: 'Pending' },
  { phoneNumber: '0987654321', otpCode: '654321', status: 'Sent' },
];

describe('TellerDashboard Component', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let store: any;

  beforeEach(() => {
    store = mockStore({
      account: { accountId: 'testAccount', accountCert: 'testCert' },
    });

    (RequestToGetOtps as jest.Mock).mockResolvedValue(JSON.stringify(mockData));
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <TellerDashboard />
      </Provider>,
    );

  test('renders Teller Dashboard correctly', async () => {
    renderComponent();
    expect(screen.getByText('Teller Dashboard')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Search phoneNumber number...'),
    ).toBeInTheDocument();
  });

  test('displays error if account information is missing', async () => {
    store = mockStore({ account: { accountId: '', accountCert: '' } });
    renderComponent();

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Account information is missing.',
      );
    });
  });

  test('filters otpCode requests based on search input', async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText('1234567890')).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByPlaceholderText('Search phoneNumber number...'),
      {
        target: { value: '0987' },
      },
    );

    expect(screen.queryByText('1234567890')).not.toBeInTheDocument();
    expect(screen.getByText('0987654321')).toBeInTheDocument();
  });

  test('opens WhatsApp link when clicking send button', async () => {
    global.open = vi.fn();

    renderComponent();
    await waitFor(() =>
      expect(screen.getByText('1234567890')).toBeInTheDocument(),
    );

    const sendButton = screen.getAllByTitle('Send via WhatsApp')[0];
    fireEvent.click(sendButton);

    expect(global.open).toHaveBeenCalledWith(
      'https://api.whatsapp.com/send?phone=1234567890&text=Your%20otpCode%20is%20123456',
      '_blank',
    );
  });

  test("displays 'No otp requests found' if search doesn't match", async () => {
    renderComponent();
    await waitFor(() =>
      expect(screen.getByText('1234567890')).toBeInTheDocument(),
    );

    fireEvent.change(
      screen.getByPlaceholderText('Search phoneNumber number...'),
      {
        target: { value: '99999' },
      },
    );

    expect(screen.getByText('No otp requests found')).toBeInTheDocument();
  });
});
