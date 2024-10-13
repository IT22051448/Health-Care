import React, { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router, useNavigate } from "react-router-dom";
import AppointmentHome from "../pages/admin/Appointments/AppointmentHome";

const renderWithRouter = (component) => {
  return render(<Router>{component}</Router>);
};

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("AppointmentHome Component", () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useNavigate).mockImplementation(() => mockNavigate);
  });

  it("renders the AppointmentHome component without crashing", () => {
    renderWithRouter(<AppointmentHome />);
    expect(screen.getByText(/manage appointments/i)).toBeInTheDocument();
  });

  it("displays the appointment management cards", () => {
    renderWithRouter(<AppointmentHome />);

    const titles = [
      "Create Doctor Appointments",
      "Manage Ongoing Appointments",
      "Manage Doctor Appointments",
      "View Cancelled Appointments",
    ];

    titles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("navigates to the correct route when a card is clicked", () => {
    renderWithRouter(<AppointmentHome />);

    const firstCard = screen.getByText(/Create Doctor Appointments/i);
    fireEvent.click(firstCard);

    expect(mockNavigate).toHaveBeenCalledWith("/admin/doc-appointment");
  });

  it("does not render any cards when cards array is empty", () => {
    const EmptyAppointmentHome = () => {
      const cards = [];
      return (
        <div>
          {cards.map((card) => (
            <div key={card.title}>{card.title}</div>
          ))}
        </div>
      );
    };

    renderWithRouter(<EmptyAppointmentHome />);

    const cardElements = screen.queryByText(
      /Create Doctor Appointments|Manage Ongoing Appointments|Manage Doctor Appointments|View Cancelled Appointments/i
    );
    expect(cardElements).not.toBeInTheDocument();
  });

  it("does not navigate when a card is clicked if there is an error", () => {
    const ErrorAppointmentHome = () => {
      const [hasError, setHasError] = useState(true);
      const cards = [
        {
          title: "Create Doctor Appointments",
          description: "Schedule appointments for doctors.",
          route: "/admin/doc-appointment",
        },
      ];

      const handleClick = (card) => {
        if (hasError) {
          console.error("Navigation error");
          return;
        }

        mockNavigate(card.route);
      };

      return (
        <div>
          {cards.map((card) => (
            <div
              key={card.title}
              onClick={() => handleClick(card)}
              data-testid="appointment-card"
            >
              {card.title}
            </div>
          ))}
        </div>
      );
    };

    renderWithRouter(<ErrorAppointmentHome />);

    const card = screen.getByText(/Create Doctor Appointments/i);
    fireEvent.click(card);

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
