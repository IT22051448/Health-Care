import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Dashboard from '../pages/admin/dashboard/dashboard';  
import { fetchDoctors } from "@/redux/appointSlice/appointSlice";

const mockStore = configureStore([]);
let store;

beforeAll(() => {
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserver;
});

jest.mock('@/redux/appointSlice/appointSlice', () => ({
  ...jest.requireActual('@/redux/appointSlice/appointSlice'),
  fetchDoctors: jest.fn(() => ({ type: 'FETCH_DOCTORS_MOCK' })),
  VITE_API_URL: "http://mock-api-url.com", 

}));





beforeEach(() => {
  store = mockStore({
    appointments: {
      doctors: [],
      appointmentsByMonth: [],
      previousAppointmentsByMonth: [],
      showPopup: false,
      error: '',
    },
  });

  store.dispatch = jest.fn(); 
});

describe('Dashboard Component', () => {
  test('renders Dashboard title', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    const titleElement = screen.getByText(/Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('fetches doctors on mount', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith(fetchDoctors());
  });

  test('shows popup when error occurs', () => {
    store = mockStore({
      appointments: {
        doctors: [],
        appointmentsByMonth: [],
        previousAppointmentsByMonth: [],
        showPopup: true,
        error: 'An error occurred',
      },
    });

    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    const popupElement = screen.getByText(/An error occurred/i);
    expect(popupElement).toBeInTheDocument();
  });

  test('changes data period to yearly', async () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );
  
    const dropdownButton = screen.getByRole('button', { name: /Monthly Data/i });
    fireEvent.click(dropdownButton);
  
    // Debugging to see the rendered output
    screen.debug();
  
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Yearly/i })).toBeInTheDocument();
    });
  
    const yearlyButton = screen.getByRole('button', { name: /Yearly/i });
    fireEvent.click(yearlyButton);
    
    expect(store.dispatch).toHaveBeenCalled();
  });

  test('generates PDF report when button is clicked', () => {
    render(
      <Provider store={store}>
        <Dashboard />
      </Provider>
    );

    const reportButton = screen.getByRole('button', { name: /Generate Report/i });
    fireEvent.click(reportButton);

  
  });

 
});
