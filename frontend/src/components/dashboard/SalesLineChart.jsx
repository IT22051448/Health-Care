import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { fetchAllAppointments } from "@/redux/appointSlice/appointSlice"; // Modify this import based on your slice

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title);

const SalesLineChart = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments); // Assuming you're fetching all appointments
  const [salesData, setSalesData] = useState(new Array(12).fill(0)); // Initialize sales data for each month

  useEffect(() => {
    dispatch(fetchAllAppointments()); // Fetch all appointments to calculate monthly sales
  }, [dispatch]);

  useEffect(() => {
    if (appointments) {
      const monthlySales = new Array(12).fill(0); // Reset the monthly sales array

      appointments.forEach((appointment) => {
        appointment.appointments.forEach((appt) => {
          const appointmentDate = new Date(appt.date); // Assuming 'date' is the field with the appointment date
          const monthIndex = appointmentDate.getMonth(); // Get month index (0 for Jan, 11 for Dec)
          const amount = appointment.payment?.amount || 0; // Get the appointment payment amount

          // Accumulate sales for the corresponding month
          monthlySales[monthIndex] += amount;
        });
      });

      setSalesData(monthlySales); // Update the sales data state
    }
  }, [appointments]);

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: salesData, 
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={data} />;
};

export default SalesLineChart;
