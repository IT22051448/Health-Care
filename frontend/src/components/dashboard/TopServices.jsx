import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAppointments } from "@/redux/appointSlice/appointSlice"; // Modify based on your slice

const TopServices = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments); // Assuming appointments are fetched from Redux
  const [topServices, setTopServices] = useState([]);

  useEffect(() => {
    dispatch(fetchAllAppointments()); // Fetch appointments on mount
  }, [dispatch]);

  useEffect(() => {
    if (appointments) {
      const serviceData = {};

      appointments.forEach((appointment) => {
        // Assuming 'service' is a string holding the service name
        const serviceName = appointment.service; // Modify this if 'service' is a different structure

        if (!serviceData[serviceName]) {
          serviceData[serviceName] = { sold: 0, totalSales: 0 };
        }

        serviceData[serviceName].sold += 1; // Count the number of times the service has been sold
        serviceData[serviceName].totalSales += appointment.payment?.amount || 0; // Accumulate total sales
      });

      // Convert serviceData object to an array and sort it
      const sortedServices = Object.entries(serviceData)
        .map(([name, { sold, totalSales }]) => ({
          name,
          sold,
          totalSales: `$${totalSales.toFixed(2)}`, // Format total sales
        }))
        .sort((a, b) => b.sold - a.sold) // Sort by sold count in descending order
        .slice(0, 3); // Take top 3 services

      setTopServices(sortedServices);
    }
  }, [appointments]);

  return (
    <div className="bg-white shadow-sm p-5 rounded-lg">
      <h3 className="text-sm text-gray-500 mb-4">Best Selling Services</h3>
      {topServices.length > 0 ? (
        topServices.map((service) => (
          <div key={service.name} className="flex justify-between mb-2">
            <p>{service.name}</p>
            <p>{service.totalSales}</p>
            <p>{service.sold} services</p>
          </div>
        ))
      ) : (
        <p>No services sold yet.</p>
      )}
    </div>
  );
};

export default TopServices;
