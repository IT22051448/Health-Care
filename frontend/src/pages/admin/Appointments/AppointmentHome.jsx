import React from "react";
import { useNavigate } from "react-router-dom";

const AppointmentHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Create Doctor Appointments",
      description:
        "Schedule Appointments For Doctors based on Hospital and Services",
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
    <div className="bg-gray-100 min-h-screen p-6">
      <header className="bg-blue-600 text-white p-2 rounded-lg mb-6">
        <h1 className="text-2xl font-bold text-center">Manage Appointments</h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 h-80 mt-10">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white shadow-lg rounded-lg p-6 border-blue-600 border-4 hover:bg-yellow-50 cursor-pointer transition-shadow duration-300"
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
