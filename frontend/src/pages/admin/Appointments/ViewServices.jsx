import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/doctorService/get-services"
        );
        setServices(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/doctorService/delete-service/${id}`
        );
        setServices(services.filter((service) => service._id !== id));
      } catch (err) {
        setError(err.message);
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
                    {service.services.map((s) => (
                      <div key={s._id}>{s.serviceType}</div>
                    ))}
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
