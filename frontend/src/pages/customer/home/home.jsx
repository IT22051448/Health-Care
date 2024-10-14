import React, { useEffect, useState } from "react";
import doctorImage from "../../../assets/doctor.jpg";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useSelector } from "react-redux";

const PatientHome = () => {
  const { user } = useSelector((state) => state.auth);

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/service/get-services"
      );
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold">Welcome to Smart Care</h1>
        <p className="text-lg mt-2">Your health is our priority!</p>
      </header>
      <div className="relative">
        <img
          src={doctorImage}
          alt="Doctor"
          className="w-full h-96 object-cover object-[center_30%]" // Adjusted object-position to center the image lower
        />
        <div className="absolute inset-0 bg-blue-600 bg-opacity-50 flex items-center justify-center">
          <h2 className="text-2xl font-semibold text-white">Caring for You</h2>
        </div>
      </div>

      <main className="container mx-auto p-6">
        <Card className="flex flex-col mb-5 items-center justify-center p-5">
          <CardHeader className="text-center text-2xl font-black">
            QR Code
          </CardHeader>
          <CardDescription className="text-center font-semibold">
            Produce this QR code at the hospital to check in for your
            appointment.
          </CardDescription>
          <CardContent>
            <img src={user.QRCodeUrl} alt="QR Code" className="w-100" />
          </CardContent>
        </Card>
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About Us</h2>
          <p className="text-gray-600 mb-4">
            At Smart Care, we offer comprehensive medical services to ensure
            your well-being. Our team of experienced healthcare professionals is
            dedicated to providing quality care in a safe and compassionate
            environment.
          </p>
          <p className="text-gray-600 mb-6">
            Whether you need routine check-ups, specialized treatments, or
            emergency care, we are here for you. Our state-of-the-art facilities
            are equipped with the latest technology to assist in diagnosing and
            treating a wide range of health conditions.
          </p>
        </section>
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-5">
            Our Services Include:
          </h3>
          {loading ? (
            <p className="text-gray-600">Loading services...</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {services.map((service) => (
                <div key={service._id} className="flex items-center">
                  <span className="w-2.5 h-2.5 bg-blue-600 rounded-full mr-2"></span>
                  {service.name}
                </div>
              ))}
            </div>
          )}
          <p className="text-gray-600 mb-6 mt-5">
            We invite you to explore our services and trust us with your
            healthcare needs. Your health matters to us!
          </p>
        </section>
      </main>
      <footer className="bg-blue-600 text-white text-center py-4 mt-6">
        <p>&copy; 2024 Smart Care. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PatientHome;
