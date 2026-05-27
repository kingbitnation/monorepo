import { Link } from "react-router-dom";

export function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
