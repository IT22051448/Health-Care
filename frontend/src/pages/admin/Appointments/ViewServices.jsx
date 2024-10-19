import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  deleteService,
  fetchServices,
} from "@/redux/appointSlice/appointSlice";

// Function to format date strings into a readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`; // Return formatted date
};

// Modal to display service details
const ServiceDetailsModal = ({ isOpen, onClose, serviceDetails }) => {
  if (!isOpen) return null; // Don't render if not open
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg">
        <h2 className="text-lg font-bold mb-4">Service Details</h2>
        <div className="max-h-60 overflow-y-auto">
          {" "}
          {/* Added scrollable area */}
          {serviceDetails.length > 0 ? (
            serviceDetails.map((detail, index) => (
              <div key={index} className="mb-2">
                <strong>Service:</strong> {detail.serviceType} <br />
                <strong>Date:</strong> {detail.date} <br />
                <strong>Time:</strong> {detail.time}
              </div>
            ))
          ) : (
            <p>No details available.</p>
          )}
        </div>
        <button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

// Modal for confirmation before deleting a service
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null; // Don't render if not open
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-11/12 max-w-lg">
        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
        <p>Are you sure you want to delete this service?</p>
        <div className="mt-4 flex justify-end">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 mr-2"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Main component to view services
const ViewServices = () => {
  const dispatch = useDispatch(); // Redux dispatch
  const navigate = useNavigate(); // Navigate for routing
  const { toast } = useToast(); // Custom toast hook for notifications
  const [isModalOpen, setIsModalOpen] = useState(false); // State for service details modal
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // State for confirmation modal
  const [selectedServiceDetails, setSelectedServiceDetails] = useState([]); // Selected service details
  const [serviceToDelete, setServiceToDelete] = useState(null); // Service ID to delete

  // Selector to get services and loading state from Redux store
  const services =
    useSelector((state) => state.appointments.servicesData) || [];
  const loading = useSelector((state) => state.appointments.loading);

  // Fetch services on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchServices()).unwrap(); // Fetch services
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load services.",
          style: { background: "red", color: "white" },
        });
      }
    };
    fetchData();
  }, [dispatch, toast]); // Added toast to dependencies for proper reference

  // Handle deletion of a service
  const handleDelete = async () => {
    if (serviceToDelete) {
      try {
        await dispatch(deleteService(serviceToDelete)).unwrap(); // Delete service
        toast({
          title: "Success",
          description: "Service deleted successfully!",
          style: { background: "green", color: "white" },
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete the service.",
          style: { background: "red", color: "white" },
        });
      } finally {
        setIsConfirmOpen(false); // Close confirmation modal
        setServiceToDelete(null); // Reset service to delete
      }
    }
  };

  // Open service details modal
  const handleOpenModal = (service) => {
    const details =
      service.services?.flatMap(
        (s) =>
          s.dates?.map((dateObj) => ({
            serviceType: s.serviceType,
            date: formatDate(dateObj.date), // Format date
            time: dateObj.times.join(", "),
          })) || []
      ) || [];

    setSelectedServiceDetails(details); // Set selected service details
    setIsModalOpen(true); // Open modal
  };

  // Open confirmation modal for deletion
  const openConfirmDelete = (id) => {
    setServiceToDelete(id); // Set service ID to delete
    setIsConfirmOpen(true); // Open confirmation modal
  };

  // Loading state display
  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Doctor Assigned Services
      </h1>
      <div className="overflow-x-auto">
        {services.length === 0 ? (
          <p className="text-center text-gray-500">No services found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">
                  Doctor Name
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">
                  Hospital Name
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">
                  Services
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700 ">
                  Number of Appointments
                </th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => {
                const numberOfAppointments = Array.isArray(service.services)
                  ? service.services.reduce(
                      (count, s) =>
                        count + (Array.isArray(s.dates) ? s.dates.length : 0),
                      0
                    )
                  : 0;

                const uniqueServices = new Set(
                  service.services?.map((s) => s.serviceType)
                );

                return (
                  <tr key={service._id} className="hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-sm">
                      {service.doctorName}
                    </td>
                    <td className="py-2 px-4 border-b text-sm">
                      {service.hospitalName}
                    </td>
                    <td className="py-2 px-4 border-b text-sm">
                      {uniqueServices.size > 0 ? (
                        Array.from(uniqueServices).map((serviceType, index) => (
                          <div key={index}>{serviceType}</div>
                        ))
                      ) : (
                        <div>No services available</div>
                      )}
                    </td>
                    <td
                      className="py-2 px-2 border-b text-sm text-center cursor-pointer w-24 text-blue-500 hover:underline"
                      onClick={() => handleOpenModal(service)}
                    >
                      {numberOfAppointments}
                    </td>
                    <td className="py-2 px-4 border-b text-sm">
                      <button
                        onClick={() =>
                          navigate(`/admin/edit-service/${service._id}`)
                        }
                        className="ml-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openConfirmDelete(service._id)}
                        className="ml-2 px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <button
        onClick={() => navigate("/admin/doc-appointment")}
        className="mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
      >
        Create New Service
      </button>
      <ServiceDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceDetails={selectedServiceDetails}
      />
      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ViewServices;
