import { useNavigate } from "react-router-dom";
import { FaTruck } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <div className="navbar-left">

        <div className="navbar-logo">
          <FaTruck />
        </div>

        <div>
          <h2>Vehicle Tracking Platform</h2>
          <p>Fleet Monitoring Dashboard</p>
        </div>

      </div>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>

    </nav>
  );
}

export default Navbar;