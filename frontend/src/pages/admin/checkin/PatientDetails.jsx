import React from "react";
import PropTypes from "prop-types";

export default function PatientDetails({ patientId }) {
  return <div>{patientId}</div>;
}

// prop validation
PatientDetails.propTypes = {
  patientId: PropTypes.string.isRequired,
};
