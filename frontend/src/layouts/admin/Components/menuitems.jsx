import { LayoutDashboard, ClockArrowUp } from "lucide-react";

// eslint-disable-next-line react-refresh/only-export-components
export const adminSideBarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard />,
  },
  {
    id: "appointment",
    label: "Appointment DashBoard",
    path: "/admin/appointment",
    icon: <ClockArrowUp />,
  },

  {
    id: "doctors",
    label: "Doctors",
    path: "/admin/doctors",
    icon: <ClockArrowUp />,
  },
];

// eslint-disable-next-line react/prop-types
const MenuItems = ({ navigate, setOpen }) => {
  return (
    <nav className="mt-8 flex-col flex gap-2 text-white">
      {adminSideBarMenuItems.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            navigate(item.path);
            setOpen ? setOpen(false) : null;
          }}
          className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground text-white"
        >
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </nav>
  );
};

export default MenuItems;
