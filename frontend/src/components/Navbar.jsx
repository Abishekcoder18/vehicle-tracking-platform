import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 30px",
        background: "#ffffff",
        borderBottom: "1px solid #ddd",
        marginBottom: "25px",
      }}
    >
      <h2 style={{ color: "#2563eb" }}>
        🚚 Vehicle Tracking Platform
      </h2>

      <button className="btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Navbar;