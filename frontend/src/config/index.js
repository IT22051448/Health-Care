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

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levis" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "HM" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
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
