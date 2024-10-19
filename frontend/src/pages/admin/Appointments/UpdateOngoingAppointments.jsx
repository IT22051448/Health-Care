import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchHospitals,
  fetchAllServices,
  fetchDoctors,
  fetchAppointmentByID,
  updateAppointment,
  deleteAppointment,
} from "@/redux/appointSlice/appointSlice";
import { useToast } from "@/hooks/use-toast";
import ConfirmationModal from "@/components/appointComponents/ConfirmationModal";

const UpdateOngoingAppointments = () => {
  const { id } = useParams(); // Get appointment ID from URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Select appointment and other data from Redux store
  const appointment = useSelector((state) =>
    state.appointments.appointments.find((appt) => appt._id === id)
  );
  const hospitals = useSelector((state) => state.appointments.hospitals);
  const servicesData = useSelector((state) => state.appointments.servicesData);
  const doctors = useSelector((state) => state.appointments.doctors);

  // State variables for form data and selections
  const [formData, setFormData] = useState(appointment || {});
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Fetch necessary data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchHospitals());
        await dispatch(fetchAllServices());
        await dispatch(fetchDoctors());
        await dispatch(fetchAppointmentByID(id));
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load data.",
          style: { background: "red", color: "white" },
        });
      }
    };
    fetchData();
  }, [dispatch, id]);

  // Set form data when appointment changes
  useEffect(() => {
    if (appointment) {
      setFormData(appointment);
      setSelectedHospital(appointment.hospital);
      setSelectedService(appointment.service);
    }
  }, [appointment]);

  // Function to handle hospital changes
  const handleHospitalChange = (e) => {
    const hospitalName = e.target.value;
    const selectedHospitalData = hospitals.find(
      (hospital) => hospital.hospitalName === hospitalName
    );

    if (selectedHospitalData) {
      setSelectedHospital(hospitalName);

      const isGovernment = selectedHospitalData.hospitalType === "Government";

      setFormData((prev) => ({
        ...prev,
        hospital: hospitalName,
        isGovernment, // Update isGovernment based on the selected hospital type
      }));
    } else {
      // Handle the case where the hospital is not found
      setSelectedHospital("");
      setFormData((prev) => ({ ...prev, hospital: "", isGovernment: false }));
    }
  };

  // useEffect to respond to isGovernment changes
  useEffect(() => {
    if (formData.isGovernment) {
      // If the hospital is government, reset payment method and amount
      setFormData((prev) => ({
        ...prev,
        payment: {
          method: "Government Hospital",
          amount: "Government Hospital",
        },
      }));
    } else {
      // If the hospital is not government, ensure isGovernment is set to false
      setFormData((prev) => ({
        ...prev,
        isGovernment: false,
        payment: {
          method: prev.payment.method || "Card Payment",
          amount: prev.payment.amount !== null ? prev.payment.amount : 0,
        },
      }));
    }
  }, [formData.isGovernment]);

  // Update selected service details when the service changes
  useEffect(() => {
    const serviceDetails = servicesData.find(
      (service) => service.name === selectedService
    );
    setSelectedServiceDetails(serviceDetails);
  }, [selectedService, servicesData]);

  // Handle focus on non-editable fields
  const handleFieldFocus = (field) => {
    if (field === "fullName" || field === "age" || field === "accountId") {
      toast({
        title: "Field Not Editable",
        description: `You cannot edit the ${field} field.`,
        style: { background: "orange", color: "white" },
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    // Validate if there is at least one appointment
    if (formData.appointments.length === 0) {
      toast({
        title: "Error",
        description: "You must add at least one appointment.",
        style: { background: "red", color: "white" },
      });
      return;
    }

    // Validate whether appointments have dates and times
    if (formData.appointments.some((apt) => !apt.date || !apt.time.length)) {
      toast({
        title: "Error",
        description: "All appointments must have a date and at least one time.",
        style: { background: "red", color: "white" },
      });
      return;
    }

    // Prepare the data to be submitted
    const appointmentData = {
      ...formData,
      payment: formData.isGovernment
        ? { method: null, amount: null, status: "Completed" }
        : formData.payment, // Use original payment data if not a government hospital
    };

    // Log the data being submitted
    console.log("Submitting appointment data:", { id, appointmentData });

    try {
      await dispatch(updateAppointment({ id, appointmentData })).unwrap();
      toast({
        title: "Success",
        description: "Appointment Updated Successfully",
        style: { background: "green", color: "white" },
      });
      navigate("/admin/ongoing-appointments");
    } catch (error) {
      toast({
        title: "Error",
        description: "Error Updating Appointment.",
        style: { background: "red", color: "white" },
      });
    }
  };

  // Handle appointment deletion
  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        await dispatch(deleteAppointment(id)).unwrap();
        toast({
          title: "Success",
          description: "Appointment deleted successfully!",
          style: { background: "green", color: "white" },
        });
        navigate("/admin/ongoing-appointments");
      } catch (error) {
        toast({
          title: "Error",
          description: "Error Deleting Appointment",
          style: { background: "red", color: "white" },
        });
      } finally {
        setConfirmDelete(false);
        setIsModalOpen(false);
      }
    }
  };

  // Modal control functions
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    setConfirmDelete(true);
    handleDelete();
  };

  // Update appointment times
  const handleAppointmentChange = (index, field, value) => {
    const updatedAppointments = [...formData.appointments];

    // Update date or time based on the field
    if (field === "date") {
      updatedAppointments[index].date = value; // Store date as a string
    } else if (field === "time") {
      updatedAppointments[index].time = value;
    }

    setFormData({ ...formData, appointments: updatedAppointments });
  };

  // Updated addAppointment function
  const addAppointment = () => {
    const newAppointment = { date: "", time: [""] }; // Create a new appointment object
    setFormData((prev) => ({
      ...prev,
      appointments: [...prev.appointments, newAppointment], // Add the new appointment to the existing list
    }));
    toast({
      title: "Appointment Added",
      description: "New appointment added.",
      style: { background: "white", color: "black" },
    });
  };

  // Updated removeAppointment function
  const removeAppointment = (index) => {
    const updatedAppointments = formData.appointments.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      appointments: updatedAppointments,
    }));
    toast({
      title: "Appointment Removed",
      description: "Appointment removed successfully.",
      style: { background: "white", color: "black" },
    });
  };

  return (
    <div className="container mx-auto mt-10 p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-blue-600">
        Update Appointments
      </h1>
      <form onSubmit={handleEditSubmit} className="space-y-6">
        {/* Patient Details Section */}
        <div className="border p-4 rounded-md shadow-md mb-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Patient Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.patientDetails?.fullName || ""}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                onClick={() => handleFieldFocus("fullName")}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.patientDetails?.age || ""}
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                onFocus={() => handleFieldFocus("age")}
              />
            </div>
            <div className="col-span-2">
              <label className="block font-semibold mb-2 text-gray-700">
                Account ID
              </label>
              <input
                type="text"
                value={formData.AID}
                readOnly
                className="w-1/2 p-2 border rounded bg-gray-100 cursor-not-allowed"
                onFocus={() => handleFieldFocus("accountId")}
              />
            </div>
            {/* Gender Selection */}
            <div className="col-span-2">
              <label className="block mb-2 font-medium text-gray-700">
                Gender
              </label>
              <div className="flex space-x-3">
                {["Male", "Female", "Other"].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        patientDetails: {
                          ...formData.patientDetails,
                          gender,
                        },
                      })
                    }
                    className={`flex-1 py-2 border rounded-md text-sm ${
                      formData.patientDetails?.gender === gender
                        ? "bg-blue-500 text-white border-blue-600"
                        : "bg-white text-black border-gray-300"
                    } hover:bg-blue-500 transition duration-200`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Service Details Section */}
        <div className="border p-4 rounded-md shadow-md mb-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Service Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Hospital
              </label>
              <select
                value={selectedHospital}
                onChange={handleHospitalChange}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">Select Hospital</option>
                {hospitals.map((hospital) => (
                  <option key={hospital._id} value={hospital.hospitalName}>
                    {hospital.hospitalName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => {
                  const serviceName = e.target.value;
                  setSelectedService(serviceName);
                  setFormData({ ...formData, service: serviceName });
                }}
                className="w-full p-2 border rounded bg-white"
                disabled={!selectedHospital}
              >
                <option value="">Select Service</option>
                {servicesData.map((service) => (
                  <option key={service._id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Doctor
              </label>
              <select
                value={formData.doctor}
                onChange={(e) =>
                  setFormData({ ...formData, doctor: e.target.value })
                }
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor.fullName}>
                    {doctor.fullName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Service Amount
              </label>
              <input
                type="text"
                value={
                  selectedServiceDetails ? selectedServiceDetails.amount : ""
                }
                readOnly
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="border p-4 rounded-md shadow-md mb-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Appointments</h2>
          {formData.appointments.length === 0 ? (
            <p className="text-gray-500 mb-7">No appointments selected.</p>
          ) : (
            formData.appointments.map((apt, index) => (
              <div
                key={apt._id}
                className="relative grid grid-cols-1 md:grid-cols-2 gap-4 mb-12"
              >
                <button
                  type="button"
                  onClick={() => removeAppointment(index)}
                  className="absolute right-2 top-[-1.5rem] bg-red-500 text-white text-xs px-4 py-3 rounded hover:bg-red-600 transition duration-200"
                >
                  Remove Appointment
                </button>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={apt.date.split("T")[0]}
                    onChange={(e) =>
                      handleAppointmentChange(index, "date", e.target.value)
                    }
                    className="w-full p-2 border rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">
                    Appointment Time
                  </label>
                  <input
                    type="time"
                    value={apt.time[0]}
                    onChange={(e) =>
                      handleAppointmentChange(index, "time", [e.target.value])
                    }
                    className="w-full p-2 border rounded bg-white"
                  />
                </div>
              </div>
            ))
          )}
          <button
            type="button"
            onClick={addAppointment}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
          >
            Add Appointment
          </button>
        </div>

        {/* Payment Details Section */}
        <div className="border p-4 rounded-md shadow-md mb-6 bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Payment Method
              </label>
              <select
                value={
                  formData.isGovernment
                    ? "Government Hospital"
                    : formData.payment.method
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment: { ...formData.payment, method: e.target.value },
                  })
                }
                disabled={formData.isGovernment}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="Card Payment">Card Payment</option>
                <option value="Cash">Cash</option>
                <option value="Insurance">Insurance</option>
              </select>
              {formData.isGovernment && (
                <p className="text-gray-500">
                  Government Hospital - No payment method required
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Payment Amount
              </label>
              <input
                type="number"
                value={formData.isGovernment ? "" : formData.payment.amount}
                onChange={(e) => {
                  const newAmount = Number(e.target.value);
                  // Only update if the new amount is not less than 0
                  if (newAmount >= 0 || formData.isGovernment) {
                    setFormData({
                      ...formData,
                      payment: { ...formData.payment, amount: newAmount },
                    });
                  }
                }}
                disabled={formData.isGovernment}
                className="w-full p-2 border rounded bg-white"
              />
              {formData.isGovernment && (
                <p className="text-gray-500">
                  Government Hospital - No payment required
                </p>
              )}
            </div>
            <div>
              <label className="block font-semibold mb-2 text-gray-700">
                Payment Status
              </label>
              <select
                value={formData.payment.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment: { ...formData.payment, status: e.target.value },
                  })
                }
                className="w-full p-2 border rounded bg-white"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            Update Appointment
          </button>
          <button
            type="button"
            onClick={handleOpenModal}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          >
            Delete Appointment
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this appointment?"
      />
    </div>
  );
};

export default UpdateOngoingAppointments;
