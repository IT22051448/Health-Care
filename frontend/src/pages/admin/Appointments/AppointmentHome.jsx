import React from "react";
import { useNavigate } from "react-router-dom";

const AppointmentHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Create Doctor Appointments",
      description:
        "Schedule appointments for doctors based on hospital and services.",
      route: "/admin/doc-appointment",
    },
    {
      title: "Manage Ongoing Appointments",
      description: "View and manage ongoing appointments.",
      route: "/admin/ongoing-appointments",
    },
    {
      title: "Manage Doctor Appointments",
      description: "Edit or delete existing doctor appointments.",
      route: "/admin/view-services",
    },
    {
      title: "View Cancelled Appointments",
      description: "Check cancelled appointments.",
      route: "/admin/cancelled-appointment",
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-300 min-h-screen p-8">
      <header className="bg-white shadow-md rounded-lg mb-8 p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Manage Appointments
        </h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <div
            key={card.title}
            className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 cursor-pointer border-l-4 border-blue-500 hover:border-yellow-500"
            onClick={() => navigate(card.route)}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {card.title}
            </h2>
            <p className="text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentHome;
