import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllAppointments } from "@/redux/appointSlice/appointSlice"; 

const MostPopularDoctors = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointments);
  const [doctorData, setDoctorData] = useState([]);

  useEffect(() => {
    dispatch(fetchAllAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (appointments) {
      const doctorCount = {};

      appointments.forEach((appointment) => {
        const doctorName = appointment.doctor; // Assuming 'doctor' holds the doctor's name

        if (!doctorCount[doctorName]) {
          doctorCount[doctorName] = 0;
        }

        doctorCount[doctorName] += 1; // Increment appointment count for this doctor
      });

      // Convert doctorCount object to an array and sort it
      const sortedDoctors = Object.entries(doctorCount)
        .map(([name, count]) => ({
          name,
          appointments: count,
        }))
        .sort((a, b) => b.appointments - a.appointments) // Sort by appointments count in descending order
        .slice(0, 5); // Take top 5 doctors (or any number you prefer)

      setDoctorData(sortedDoctors);
    }
  }, [appointments]);

  return (
    <div className="bg-white shadow-sm p-5 rounded-lg">
      <h3 className="text-sm text-gray-500 mb-4">Most Popular Doctors</h3>
      {doctorData.length > 0 ? (
        doctorData.map((doctor) => (
          <div key={doctor.name} className="flex justify-between mb-2">
            <p>{doctor.name}</p>
            <p>{doctor.appointments} appointments</p>
          </div>
        ))
      ) : (
        <p>No appointments available.</p>
      )}
    </div>
  );
};

export default MostPopularDoctors;
