import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, Ambulance } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MenuItems from "./menuItem";
import HeaderRightContent from "./headerRightContent";

const ShoppingHeader = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const userEmail = useSelector((state) => state.auth.user?.email);

  return (
    <header className="sticky top-0 z-40 w-full border bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/patient/home" className="flex items-center gap-2">
          <Ambulance className="h-6 w-6" />
          <span className="font-bold">Smart Health Care System</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        {isAuthenticated ? (
          <div>
            <HeaderRightContent />
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default ShoppingHeader;
