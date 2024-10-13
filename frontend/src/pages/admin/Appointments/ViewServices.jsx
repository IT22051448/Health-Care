import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteService,
  fetchServices,
} from "@/redux/appointSlice/appointSlice";

const ViewServices = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const services = useSelector((state) => state.appointments.servicesData);
  const loading = useSelector((state) => state.appointments.loading);
  const error = useSelector((state) => state.appointments.error);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(fetchServices());
    };
    fetchData();
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await dispatch(deleteService(id));
      } catch (err) {
        // Handle error if needed
      }
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Services</h1>
      <div className="overflow-x-auto">
        {services.length === 0 ? (
          <p className="text-center">No services found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-1 px-2 border-b text-left text-sm">
                  Doctor Name
                </th>
                <th className="py-1 px-2 border-b text-left text-sm">
                  Hospital Name
                </th>
                <th className="py-1 px-2 border-b text-left text-sm">
                  Services
                </th>
                <th className="py-1 px-2 border-b text-left text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="hover:bg-gray-50">
                  <td className="py-1 px-2 border-b text-sm">
                    {service.doctorName}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {service.hospitalName}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    {service.services && service.services.length > 0 ? (
                      service.services.map((s) => (
                        <div key={s._id}>{s.serviceType}</div>
                      ))
                    ) : (
                      <div>No services available</div>
                    )}
                  </td>
                  <td className="py-1 px-2 border-b text-sm">
                    <button
                      onClick={() =>
                        navigate(`/admin/edit-service/${service._id}`)
                      }
                      className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <button
        onClick={() => navigate("/admin/doc-appointment")}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Create New Service
      </button>
    </div>
  );
};

export default ViewServices;
