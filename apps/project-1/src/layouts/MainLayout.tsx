import { Outlet } from "react-router-dom";
import { NavBar } from "@/components/NavBar";

export function MainLayout() {
  return (
    <div>
      <NavBar />
      <div className="page-wrap">
        <Outlet />
      </div>
    </div>
  );
}
