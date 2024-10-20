import React from "react";

const AboutUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold">About Us</h1>
        <p className="text-lg mt-2">Our mission is your health!</p>
      </header>

      <main className="container mx-auto p-6">
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Who We Are</h2>
          <p className="text-gray-600 mb-4">
            At Smart Care, we believe in a patient-centered approach to
            healthcare. Our dedicated team of medical professionals is committed
            to delivering high-quality care tailored to your needs.
          </p>
          <p className="text-gray-600 mb-6">
            With years of experience and a passion for healthcare, we strive to
            create a welcoming environment for all our patients. Your well-being
            is our priority.
          </p>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h2>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Compassion: We care for you as if you are family.</li>
            <li>Integrity: We uphold the highest standards in our services.</li>
            <li>Innovation: We embrace new technologies for better care.</li>
            <li>
              Collaboration: We work together with you for the best outcomes.
            </li>
          </ul>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 mb-4">
            We offer a range of medical services, including:
          </p>
          <ul className="list-disc list-inside text-gray-600">
            <li>General Health Check-ups</li>
            <li>Specialized Medical Treatments</li>
            <li>Emergency Care Services</li>
            <li>Telemedicine Consultations</li>
          </ul>
          <p className="text-gray-600 mt-4">
            Your health is our mission. Explore our services and let us take
            care of you!
          </p>
        </section>
      </main>

      <footer className="bg-blue-600 text-white text-center py-4 mt-6">
        <p>&copy; 2024 Smart Care. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutUs;
