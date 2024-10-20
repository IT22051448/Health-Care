export const resigterFormControls = [
  {
    name: "username",
    label: "User Name",
    placeholder: "Enter your name",
    componentType: "input",
    type: "text",
  },
  {
    name: "firstname",
    label: "First Name",
    placeholder: "Enter your first name",
    componentType: "input",
    type: "text",
  },
  {
    name: "lastname",
    label: "Lastname Name",
    placeholder: "Enter your last name",
    componentType: "input",
    type: "text",
  },

  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "gender",
    label: "Gender",
    componentType: "radio",
    options: [
      {
        id: "male",
        name: "Male",
      },
      { id: "female", name: "Female" },
      { id: "other", name: "Other" },
    ],
  },
  {
    name: "DOB",
    label: "Date of Birth",
    componentType: "datepicker",
    type: "date",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "username",
    label: "User Name",
    placeholder: "Enter your name",
    componentType: "input",
    type: "text",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const shopHeaderLinks = [
  {
    id: "home",
    label: "Home",
    path: "/patient/home",
  },
  {
    id: "bookappointments",
    label: "Book Appointments",
    path: "/patient/appointment",
  },
  {
    id: "scheduledappointments",
    label: "View Appointments",
    path: "/patient/scheduled-appoint",
  },
  {
    id: "healthpackage",
    label: "Health Check Pakages",
    path: "/patient/health-package",
  },
  {
    id: "aboutus",
    label: "About Us",
    path: "/patient/about-us",
  },
  {
    id: "contactus",
    label: "Contact Us",
    path: "/patient/contact-us",
  },
];
