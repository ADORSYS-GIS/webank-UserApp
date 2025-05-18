import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { store } from '@wua/store/Store.ts';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { Component as SettingsPage } from '../SettingsPage';

describe('SettingsPage', () => {
  it('renders the settings page with title and description', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      </Provider>,
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders all menu items', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SettingsPage />
        </MemoryRouter>
      </Provider>,
    );

    expect(screen.getByText('Help & Support')).toBeInTheDocument();
    expect(screen.getByText('Email verification')).toBeInTheDocument();
  });
});
