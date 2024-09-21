import { shopHeaderLinks } from "@/config";
import { Link } from "react-router-dom";

const MenuItems = () => {
  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shopHeaderLinks
        .filter((menuItem) => !menuItem.isLoyalty) // Keep this if your links might still include a loyalty filter
        .map((menuItem) => (
          <Link
            className="text-sm font-medium"
            key={menuItem.id}
            to={menuItem.path}
          >
            {menuItem.label}
          </Link>
        ))}
    </nav>
  );
};

export default MenuItems;
