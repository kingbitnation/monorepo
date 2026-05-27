import { Link, Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div>
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <div className="page-wrap">
        <Outlet />
      </div>
    </div>
  );
}
