import React, { useEffect, useState,useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StatisticCard from '../../../components/dashboard/statisticsCard';
import SalesLineChart from '../../../components/dashboard/SalesLineChart';
import MostPopularDoctors from '../../../components/dashboard/MostPopularDoctors';
import BestSellingServices from '../../../components/dashboard/TopServices';
import Popup from '../../../components/ui/Popup'; // Import the Popup component
import { fetchDoctors, getAllAppointmentsByMonth, getPreviousAppointmentsByMonth } from "@/redux/appointSlice/appointSlice";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const Dashboard = () => {
  const dispatch = useDispatch();
  const doctors = useSelector((state) => state.appointments.doctors);
  const { appointmentsByMonth, previousAppointmentsByMonth } = useSelector((state) => state.appointments);

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
  const [previousAppointmentCount, setPreviousAppointmentCount] = useState(0);

  const salesChartRef = useRef(null);
  const doctorsRef = useRef(null);
  const servicesRef = useRef(null);

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add report title
    doc.setFontSize(18);
    doc.text('Analytics report', 10, 10);
    doc.setFontSize(12);
    
    if(dataPeriod=="monthly"){
      doc.text(`For the month: ${selectedMonth} ${selectedYear}`, 10, 20);
    }
    else{
      doc.text(`For the year: ${selectedYear}`, 10, 20);
    }

    // Add Sales Information
    doc.setFontSize(14);
    doc.text('Sales Data:', 10, 30);
    doc.setFontSize(12);
    doc.text(`Total Sales: $${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 40);
    doc.text(`Service Charges: $${serviceCharges.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 10, 50);
    doc.text(`Total Sales Change: ${totalSalesPercentageChange.toFixed(2)}%`, 10, 60);
    doc.text(`Service Charges Change: ${serviceChargesPercentageChange.toFixed(2)}%`, 10, 70);

    // Capture Sales Chart as Image
    html2canvas(salesChartRef.current).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(imgData, 'PNG', 10, 80, 180, 60); // Adjust position and size as needed

      // Add Appointments Information
      doc.setFontSize(14);
      doc.text('Appointments Data:', 10, 150);
      doc.setFontSize(12);
      doc.text(`Total Appointments: ${appointmentCount}`, 10, 160);
      doc.text(`Appointment Change: ${appointmentCountPercentageChange.toFixed(2)}%`, 10, 170);

      // Add Doctors Information
      doc.setFontSize(14);
      doc.text('Doctors Data:', 10, 180);
      doc.setFontSize(12);
      doc.text(`Number of Doctors: ${doctorCount}`, 10, 190);

      // Capture Most Popular Doctors as Image
      html2canvas(doctorsRef.current).then((canvasDoctors) => {
        const doctorsImgData = canvasDoctors.toDataURL('image/png');
        doc.addImage(doctorsImgData, 'PNG', 10, 200, 180, 60); // Adjust position and size as needed

        // Capture Top Services as Image
        html2canvas(servicesRef.current).then((canvasServices) => {
          const servicesImgData = canvasServices.toDataURL('image/png');
          doc.addImage(servicesImgData, 'PNG', 10, 270, 180, 60); // Adjust position and size as needed

          // Save the PDF
          doc.save('dashboard_report.pdf');
        });
      });
    });
  };

  
  
  const handleClosePopup = () => {
    dispatch({ type: 'RESET_POPUP' }); // Reset the popup state
  };

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (dataPeriod === "monthly" || dataPeriod === "yearly") {
      dispatch(getAllAppointmentsByMonth({ year: selectedYear, month: selectedMonth }));
      
      // Fetch previous month's or previous year's data
      if(selectedMonth!=null){
      const previousMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
      const previousYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
      dispatch(getPreviousAppointmentsByMonth({ year: previousYear, month: previousMonth }));
      }
      else{
        const previousMonth = null; 
        const previousYear = selectedYear - 1;
        dispatch(getPreviousAppointmentsByMonth({ year: previousYear, month: previousMonth }));
      }
      
      
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

    // Calculate percentage change for appointments
    if (previousAppointmentsByMonth) {
      setPreviousAppointmentCount(previousAppointmentsByMonth.length);
    }

    // Calculate percentage change for total sales and service charges
    if (previousAppointmentsByMonth) {
      const previousTotal = previousAppointmentsByMonth.reduce((sum, appointment) => {
        return sum + (appointment.payment?.amount || 0);
      }, 0);
      setPreviousTotalSales(previousTotal);
      setPreviousServiceCharges(previousTotal * 0.125);
    }
  }, [appointmentsByMonth, previousAppointmentsByMonth]);

  // Calculate percentage changes
  const totalSalesPercentageChange = previousTotalSales
    ? ((totalSales - previousTotalSales) / previousTotalSales) * 100
    : 0;
  
  const serviceChargesPercentageChange = previousServiceCharges
    ? ((serviceCharges - previousServiceCharges) / previousServiceCharges) * 100
    : 0;
  
  const appointmentCountPercentageChange = previousAppointmentCount
    ? ((appointmentCount - previousAppointmentCount) / previousAppointmentCount) * 100
    : 0;

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
      <div className="mb-5 mt-0 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">Here's your analytic details.</p>
        </div>
      <div className="mt-7">
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

        {/* Year and Month Dropdowns based on Period Selection */}
      <div className="mb-6 mt-2">
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
          <div className="relative inline-block text-left ml-2">
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
      <div>
      <button
        onClick={generatePDF}
        className="inline-flex justify-between w-full rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-blue-300 hover:bg-blue-50"
      >
        Generate Report
      </button>
      </div>
        </div>
      </div>

      

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatisticCard 
          title="Total Sales" 
          value={`$${totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          percentage={totalSalesPercentageChange.toFixed(2)} 
          isPositive={totalSalesPercentageChange >= 0} 
        />
        <StatisticCard 
          title="Service Charges" 
          value={`$${serviceCharges.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          percentage={serviceChargesPercentageChange.toFixed(2)} 
          isPositive={serviceChargesPercentageChange >= 0} 
        />
        <StatisticCard 
          title="Appointments Made" 
          value={appointmentCount} 
          percentage={appointmentCountPercentageChange.toFixed(2)} 
          isPositive={appointmentCountPercentageChange >= 0} 
        />
        <StatisticCard 
          title="No. of Doctors" 
          value={doctorCount} 
          percentage={null} 
          isPositive={true} 
        />
      </div>

       {/* Sales Line Chart (use ref) */}
       <div ref={salesChartRef} className="bg-white shadow-sm p-5 rounded-lg mb-6">
        <h3 className="text-sm text-gray-500 mb-4">Sales by month</h3>
        <SalesLineChart />
      </div>

      {/* Popular Doctors & Best Selling Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div ref={doctorsRef}>
          <MostPopularDoctors />
        </div>
        <div ref={servicesRef}>
          <BestSellingServices />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
