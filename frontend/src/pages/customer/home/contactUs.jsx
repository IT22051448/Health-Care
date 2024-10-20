import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-6">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <p className="text-lg mt-2">We’re here to help!</p>
      </header>

      <main className="container mx-auto p-6">
        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-600 mb-4">
            Have questions or need assistance? We’d love to hear from you! You
            can reach us through the following methods:
          </p>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Contact Information
          </h3>
          <ul className="list-none text-gray-600">
            <li className="mb-2">
              <strong>Email:</strong> support@smartcare.com
            </li>
            <li className="mb-2">
              <strong>Phone:</strong> +1 (555) 123-4567
            </li>
            <li className="mb-2">
              <strong>Address:</strong> 123 Health St, Wellness City, CA 12345
            </li>
          </ul>
        </section>

        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Send Us a Message
          </h3>
          <form className="flex flex-col">
            <label className="mb-2 text-gray-600" htmlFor="name">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="border border-gray-300 rounded-md p-2 mb-4"
              placeholder="Your Name"
              required
            />

            <label className="mb-2 text-gray-600" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="border border-gray-300 rounded-md p-2 mb-4"
              placeholder="Your Email"
              required
            />

            <label className="mb-2 text-gray-600" htmlFor="message">
              Message:
            </label>
            <textarea
              id="message"
              className="border border-gray-300 rounded-md p-2 mb-4"
              rows="4"
              placeholder="Your Message"
              required
            ></textarea>

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </section>
      </main>

      <footer className="bg-blue-600 text-white text-center py-4 mt-6">
        <p>&copy; 2024 Smart Care. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ContactUs;
