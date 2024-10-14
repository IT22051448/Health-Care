import React from "react";
import { useNavigate } from "react-router-dom";

const AppointmentHome = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes

  // Array of card objects to represent different appointment management options
  const cards = [
    {
      title: "Create Doctor Appointments", // Title for creating appointments
      description:
        "Schedule appointments for doctors based on hospital and services.", // Description for the card
      route: "/admin/doc-appointment", // Route to navigate when the card is clicked
    },
    {
      title: "Manage Ongoing Appointments", // Title for managing ongoing appointments
      description: "View and manage ongoing appointments.", // Description for the card
      route: "/admin/ongoing-appointments", // Route to navigate when the card is clicked
    },
    {
      title: "Manage Doctor Appointments", // Title for managing existing appointments
      description: "Edit or delete existing doctor appointments.", // Description for the card
      route: "/admin/view-services", // Route to navigate when the card is clicked
    },
    {
      title: "View Cancelled Appointments", // Title for viewing cancelled appointments
      description: "Check cancelled appointments.", // Description for the card
      route: "/admin/cancelled-appointment", // Route to navigate when the card is clicked
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-300 min-h-screen p-8">
      {" "}
      {/* Background gradient and padding */}
      <header className="bg-white shadow-md rounded-lg mb-8 p-6">
        {" "}
        {/* Header section */}
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Manage Appointments {/* Main title */}
        </h1>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {" "}
        {/* Responsive grid layout for cards */}
        {cards.map((card, index) => (
          <div
            key={card.title} // Unique key for each card
            className="bg-white shadow-lg rounded-lg p-6 transition-transform transform hover:scale-105 cursor-pointer border-l-4 border-blue-500 hover:border-yellow-500" // Card styling with hover effects
            onClick={() => navigate(card.route)} // Navigate to the specified route on click
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {card.title} {/* Card title */}
            </h2>
            <p className="text-gray-600">{card.description}</p>{" "}
            {/* Card description */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentHome; // Export the component for use in other parts of the application
