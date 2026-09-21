import { useNavigate } from "react-router-dom";
import { FaTruck, FaUsers, FaArrowRight } from "react-icons/fa";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing-container">

        <div className="landing-brand">
          <div className="landing-logo">🚚</div>

          <div>
            <h1>FleetCommand</h1>
            <p>Vehicle Tracking & Fleet Management Platform</p>
          </div>
        </div>

        <div className="landing-content">
          <span className="landing-label">FLEET OPERATIONS PLATFORM</span>

          <h2>How would you like to access FleetCommand?</h2>

          <p className="landing-description">
            Select your role to continue to the appropriate fleet workspace.
          </p>

          <div className="role-cards">

            <button
              className="role-card"
              onClick={() => navigate("/login?role=operator")}
            >
              <div className="role-icon">
                <FaTruck />
              </div>

              <div className="role-info">
                <span className="role-label">OPERATIONS</span>
                <h3>Logistics Operator</h3>

                <p>
                  Track vehicles, monitor active trips and respond to
                  operational alerts.
                </p>
              </div>

              <div className="role-arrow">
                <FaArrowRight />
              </div>
            </button>

            <button
              className="role-card"
              onClick={() => navigate("/login?role=manager")}
            >
              <div className="role-icon">
                <FaUsers />
              </div>

              <div className="role-info">
                <span className="role-label">MANAGEMENT</span>
                <h3>Fleet Manager</h3>

                <p>
                  Manage vehicles, drivers, trips and daily fleet
                  assignments.
                </p>
              </div>

              <div className="role-arrow">
                <FaArrowRight />
              </div>
            </button>

          </div>

          <div className="landing-footer">
            Secure fleet operations • Real-time visibility • Centralized management
          </div>
        </div>

      </div>
    </div>
  );
}

export default Landing;