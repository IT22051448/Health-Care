import { Fragment } from "react";
import { ChartNoAxesCombined } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuItems from "./menuitems";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// eslint-disable-next-line react/prop-types
const AdminSidebar = ({ open, setOpen }) => {
  const navigate = useNavigate();

  return (
    <Fragment>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64 bg-blue-500">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle className="flex gap-2 mt-5 mb-5">
                <ChartNoAxesCombined size={30} />
                <h1 className="text-xl font-extrabold">
                  Smart Health Care System
                </h1>
              </SheetTitle>
            </SheetHeader>
            <MenuItems setOpen={setOpen} navigate={navigate} />
          </div>
        </SheetContent>
      </Sheet>
      <aside className="hidden w-64 flex-col border-r bg-blue-400 p-6 lg:flex rounded-r-3xl">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex cursor-pointer items-center gap-2"
        >
          <ChartNoAxesCombined size={30} />
          <h1 className="text-lg font-extrabold text-white ">
            Smart Health Care System
          </h1>
        </div>
        <MenuItems navigate={navigate} />
      </aside>
      
    </Fragment>
  );
};

export default AdminSidebar;
