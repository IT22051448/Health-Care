import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./layouts/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthSignup from "./pages/auth/signup";
import AdminLayout from "./layouts/admin/layout";
import AdminDashboard from "./pages/admin/dashboard/dashboard";

import NotFound from "./pages/not-found/notfound";
import CustomerLayout from "./layouts/customer/layout";
import PatientHome from "./pages/customer/home/home";
import Profile from "./pages/customer/profile/profile";
import UnAuthPage from "./pages/unauth-page";
import CheckAuth from "./components/common/check-auth";
import { useSelector } from "react-redux";

import BookAppointments from "./pages/customer/appointments/BookAppointments";
import AppointmentSummary from "./pages/customer/appointments/AppointmentSummery";
import ScheduleDoctorAppointments from "./pages/admin/Appointments/ScheduleDoctorAppointments";
import ScheduledAppointments from "./pages/customer/appointments/ScheduledAppointments";

import AdminAppointmentHome from "./pages/admin/Appointments/AppointmentHome";
import ViewCancelledAppointments from "./pages/admin/Appointments/ViewCancelledAppointments";
import ViewServices from "./pages/admin/Appointments/ViewServices";
import EditService from "./pages/admin/Appointments/EditServices";
import OngoingAppointments from "./pages/admin/Appointments/OngoingAppointments";
import UpdateOngoingAppointments from "./pages/admin/Appointments/UpdateOngoingAppointments";

import AboutUs from "./pages/customer/home/aboutUs";
import ContactUs from "./pages/customer/home/contactUs";
import HealthPackages from "./pages/customer/home/healthPackages";

import DocList from "./pages/admin/doctors/docList";
import HospitalList from "./pages/admin/hospitals/hospitalList";
import MedServices from "./pages/admin/medServices/MedServices";
import DoctorProfile from "./pages/admin/doctors/DoctorProfile";
import CheckIn from "./pages/admin/checkin/CheckIn";

function App() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  console.log(user);

  return (
    <>
      <Routes>
        <Route path="/" element={<CheckAuth />} />
        <Route
          path="/auth"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="signup" element={<AuthSignup />} />
        </Route>

        <Route
          path="/admin"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="appointment" element={<AdminAppointmentHome />} />
          <Route
            path="cancelled-appointment"
            element={<ViewCancelledAppointments />}
          />
          <Route
            path="doc-appointment"
            element={<ScheduleDoctorAppointments />}
          />
          <Route path="view-services" element={<ViewServices />} />
          <Route path="edit-service/:id" element={<EditService />} />
          <Route
            path="ongoing-appointments"
            element={<OngoingAppointments />}
          />
          <Route
            path="appointments/:id"
            element={<UpdateOngoingAppointments />}
          />

          <Route path="doctors" element={<DocList />} />
          <Route path="doctors/profile/:id" element={<DoctorProfile />} />
          <Route path="hospitals" element={<HospitalList />} />
          <Route path="med-services" element={<MedServices />} />
          <Route path="checkin" element={<CheckIn />} />
        </Route>

        <Route
          path="/patient"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <CustomerLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<PatientHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="appointment" element={<BookAppointments />} />
          <Route path="appointment-summary" element={<AppointmentSummary />} />
          <Route path="scheduled-appoint" element={<ScheduledAppointments />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="contact-us" element={<ContactUs />} />
          <Route path="health-package" element={<HealthPackages />} />
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/unauth-page" element={<UnAuthPage />} />
      </Routes>
    </>
  );
}

export default App;
