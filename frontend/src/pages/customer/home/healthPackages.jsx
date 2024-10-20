import React from "react";
import image from "@/assets/comingsoon.jpg";

const HealthPackages = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <header className="bg-blue-600 text-white p-6 w-full">
        <h1 className="text-3xl font-bold text-center">Health Packages</h1>
        <p className="text-lg mt-2 text-center">
          Exciting offerings on the way!
        </p>
      </header>

      <main className="container mx-auto p-6 flex-grow flex flex-col items-center justify-center">
        <div className="bg-white shadow-md rounded-lg p-8 mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Coming Soon!
          </h2>
          <p className="text-gray-600 mb-4">
            We are currently working on our Health Packages to provide you with
            comprehensive and tailored options for your wellness journey.
          </p>
          <p className="text-gray-600 mb-6">
            Stay tuned for more updates! We can't wait to share these exciting
            packages with you.
          </p>
          <img
            src={image} // Using the imported image
            alt="Coming Soon"
            className="w-40 mx-auto mb-4"
          />
          <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
            Notify Me
          </button>
        </div>
      </main>

      <footer className="bg-blue-600 text-white text-center py-4 mt-6 w-full">
        <p>&copy; 2024 Smart Care. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HealthPackages;
