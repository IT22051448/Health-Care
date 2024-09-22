import React, { useState } from "react";
import AppointmentForm from "../../../components/appointComponents/AppointmentForm";
import DateTimePickerModal from "../../../components/appointComponents/DateTimePickerModal";

const BookAppointments = () => {
  const [appointmentDates, setAppointmentDates] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Handle the addition of new dates and times
  const handleAddDates = (dates) => {
    setAppointmentDates([...appointmentDates, ...dates]);
    setShowDatePicker(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-10 px-4">
      <div className="bg-[#6F93D9] p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Schedule an Appointment
        </h1>
        <AppointmentForm
          appointmentDates={appointmentDates}
          onOpenDatePicker={() => setShowDatePicker(true)}
        />
        {showDatePicker && (
          <DateTimePickerModal
            onClose={() => setShowDatePicker(false)}
            onAddDates={handleAddDates}
          />
        )}
      </div>
    </div>
  );
};

export default BookAppointments;
