import { Outlet } from "@remix-run/react";
import Header from "~/components/Header/Header";
import Menu from "~/components/Menu";

export default function GetIndex() {
  return (
    <div>
      <Header />
      <div className="grid grid-cols-5 mt-5 relative overflow-hidden">
        <Menu />
        <div className="w-full col-span-5 md:col-span-4 relative px-5">
          <div className="relative">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
