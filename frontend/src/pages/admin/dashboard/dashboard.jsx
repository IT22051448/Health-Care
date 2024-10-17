import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatisticCard from '../../../components/dashboard/statisticsCard';
import SalesLineChart from '../../../components/dashboard/SalesLineChart';
import MostPopularDoctors from '../../../components/dashboard/MostPopularDoctors';
import BestSellingServices from '../../../components/dashboard/TopServices';
import Popup from '../../../components/ui/Popup'; // Import the Popup component
import { fetchDoctors, getAllAppointmentsByMonth} from "@/redux/appointSlice/appointSlice";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Dashboard = () => {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.appointments.doctors);
  const { appointmentsByMonth } = useSelector((state) => state.appointments);
  
  const { showPopup, error } = useSelector((state) => state.appointments);
  
  const [doctorCount, setDoctorCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [serviceCharges, setServiceCharges] = useState(0);
  const [dataPeriod, setDataPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [previousTotalSales, setPreviousTotalSales] = useState(0);
  const [previousServiceCharges, setPreviousServiceCharges] = useState(0);

  const handleClosePopup = () => {
    dispatch({ type: 'RESET_POPUP' }); // Reset the popup state
  };

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (dataPeriod === "monthly" || dataPeriod === "yearly") {
      dispatch(getAllAppointmentsByMonth({ year: selectedYear, month: selectedMonth }));
    }
  }, [dataPeriod, selectedYear, selectedMonth, dispatch]);

  useEffect(() => {
    if (doctors) {
      setDoctorCount(doctors.length);
    }
  }, [doctors]);

  useEffect(() => {
    if (appointmentsByMonth) {
      setAppointmentCount(appointmentsByMonth.length);
      const total = appointmentsByMonth.reduce((sum, appointment) => {
        return sum + (appointment.payment?.amount || 0);
      }, 0);
      setTotalSales(total);
      setServiceCharges(total * 0.125);
    }
  }, [appointmentsByMonth]);

  

  const handlePeriodChange = (period) => {
    setDataPeriod(period);
    if (period === "yearly") {
      setSelectedMonth(null);
    }
  };

  return (
    <div className="p-6">
      {showPopup && (
        <Popup message={error} onClose={handleClosePopup} />
      )}
      <div className="mb-5 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">Here's your analytic details.</p>
        </div>

        {/* Dropdown for Monthly/Yearly selection */}
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {dataPeriod.charAt(0).toUpperCase() + dataPeriod.slice(1)} Data
              <ChevronDownIcon aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400" />
            </MenuButton>
          </div>

          <MenuItems className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => handlePeriodChange("monthly")}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    Monthly
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => handlePeriodChange("yearly")}
                    className={`${
                      active ? 'bg-gray-100' : ''
                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                  >
                    Yearly
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Menu>
      </div>

      {/* Year and Month Dropdowns based on Period Selection */}
      <div className="mb-6">
        {/* Year Dropdown */}
        <div className="relative inline-block text-left mb-4">
          <Menu as="div" className="relative">
            <MenuButton className="inline-flex justify-between w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {selectedYear} <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <MenuItem key={year}>
                    {({ active }) => (
                      <button
                        onClick={() => setSelectedYear(year)}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                      >
                        {year}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>
        </div>

        {/* Month Dropdown (only visible if monthly is selected) */}
        {dataPeriod === "monthly" && (
          <div className="relative inline-block text-left">
            <Menu as="div" className="relative">
              <MenuButton className="inline-flex justify-between w-full rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                {selectedMonth} <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" />
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="py-1">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <MenuItem key={month}>
                      {({ active }) => (
                        <button
                          onClick={() => setSelectedMonth(month)}
                          className={`${
                            active ? 'bg-gray-100' : ''
                          } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                        >
                          {month}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Menu>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatisticCard 
          title="Total Sales" 
          value={`$${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          percentage="12.00" 
          isPositive={true} 
        />
        <StatisticCard 
          title="Service Charges" 
          value={`$${serviceCharges.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          percentage="8.50" 
          isPositive={true} 
        />
        <StatisticCard 
          title="Appointments Made" 
          value={appointmentCount} 
          percentage="9.07" 
          isPositive={true} 
        />
        <StatisticCard 
          title="No. of Doctors" 
          value={doctorCount} 
          percentage={null} 
          isPositive={true} 
        />
      </div>

      {/* Sales Chart */}
      <div className="bg-white shadow-sm p-5 rounded-lg mb-6">
        <h3 className="text-sm text-gray-500 mb-4">Sales by month</h3>
        <SalesLineChart />
      </div>

      {/* Popular Doctors & Best Selling Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MostPopularDoctors />
        <BestSellingServices />
      </div>
    </div>
  );
};

export default Dashboard;
