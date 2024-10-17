// src/components/Popup.js
import React from 'react';

const Popup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose} />
      <div className="bg-white rounded-lg p-6 shadow-lg z-10">
        <h2 className="text-lg font-semibold">Error</h2>
        <p className="mt-2">No appointments found for the specified period.</p>
        <div className="flex justify-center mt-4"> {/* Centering the button */}
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
