import { useEffect, useState } from "react";
import {
  FaTruck,
  FaMapMarkerAlt,
  FaRoute,
  FaBell,
  FaCircle,
  FaSyncAlt,
} from "react-icons/fa";

import GoogleMap from "../components/GoogleMap";
import api from "../services/api";
import "./OperatorDashboard.css";

function OperatorDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const operatorVehicles = [
    {
      id: 1,
      registration: "TN45TR8343",
      status: "Maintenance",
      location: "Trichy Depot",
    },
    {
      id: 2,
      registration: "TN457890",
      status: "Available",
      location: "Trichy",
    },
    {
      id: 3,
      registration: "TN45AB1234",
      status: "Available",
      location: "Trichy",
    },
  ];

  const activeTrips = [
    {
      id: "TRP-0021",
      route: "Trichy → Madurai",
      vehicle: "TN45AB1234",
      driver: "Arun Kumar",
      status: "Ready",
    },
    {
      id: "TRP-0022",
      route: "Trichy → Chennai",
      vehicle: "TN457890",
      driver: "Arun Kumar",
      status: "Ready",
    },
  ];

  const loadDashboard = async () => {
    try {
      const response = await api.get("/dashboard/");
      setDashboard(response.data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const refresh = () => {
    loadDashboard();
  };

  return (
    <div className="operator-dashboard">

      {/* SIDEBAR */}
      <aside className="operator-sidebar">

        <div className="operator-brand">
          <div className="operator-brand-icon">🚚</div>

          <div>
            <h1>FleetCommand</h1>
            <span>Operations Platform</span>
          </div>
        </div>

        <div className="operator-role">
          <small>LOGGED IN AS</small>
          <strong>Logistics Operator</strong>
        </div>

        <div className="operator-nav-title">
          OPERATIONS
        </div>

        <nav>
          <div className="operator-nav active">
            <FaRoute />
            Operations
          </div>

          <div className="operator-nav">
            <FaMapMarkerAlt />
            Live Map
          </div>

          <div className="operator-nav">
            <FaTruck />
            Vehicles
          </div>

          <div className="operator-nav">
            <FaRoute />
            Active Trips
          </div>

          <div className="operator-nav">
            <FaBell />
            Alerts
          </div>
        </nav>

        <div className="operator-sidebar-bottom">
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Sign out
          </button>
        </div>

      </aside>

      {/* MAIN */}
      <main className="operator-main">

        <header className="operator-header">

          <div>
            <span>FLEET OPERATIONS / TRACKING</span>
            <h2>Live Operations</h2>
            <p>
              Monitor vehicles and active fleet movements.
            </p>
          </div>

          <div className="operator-header-right">
            <div className="live-status">
              <FaCircle />
              LIVE
            </div>

            <small>
              Last update {lastUpdate.toLocaleTimeString()}
            </small>

            <button onClick={refresh} className="refresh-btn">
              <FaSyncAlt />
            </button>
          </div>

        </header>

        {/* KPI CARDS */}

        <section className="operator-kpis">

          <div className="operator-kpi">
            <div className="kpi-icon blue">
              <FaTruck />
            </div>

            <div>
              <span>Tracked Vehicles</span>
              <strong>
                {dashboard?.total_vehicles ?? 3}
              </strong>
              <small>Fleet visibility</small>
            </div>
          </div>

          <div className="operator-kpi">
            <div className="kpi-icon green">
              <FaCircle />
            </div>

            <div>
              <span>Available</span>
              <strong>
                {dashboard?.available_vehicles ?? 2}
              </strong>
              <small>Ready for assignment</small>
            </div>
          </div>

          <div className="operator-kpi">
            <div className="kpi-icon orange">
              <FaRoute />
            </div>

            <div>
              <span>Active Trips</span>
              <strong>
                {dashboard?.running_trips ?? 0}
              </strong>
              <small>Currently operating</small>
            </div>
          </div>

          <div className="operator-kpi">
            <div className="kpi-icon red">
              <FaBell />
            </div>

            <div>
              <span>Alerts</span>
              <strong>
                {dashboard?.maintenance_vehicles ?? 0}
              </strong>
              <small>Need attention</small>
            </div>
          </div>

        </section>

        {/* MAP + ALERTS */}

        <section className="operator-grid">

          <div className="operator-panel map-panel">

            <div className="panel-heading">
              <div>
                <span>LIVE TRACKING</span>
                <h3>Fleet Map</h3>
              </div>

              <span className="map-live">
                <FaCircle /> Live
              </span>
            </div>

            <div className="operator-map">
              <GoogleMap
                trips={[]}
                vehicles={[]}
              />
            </div>

          </div>

          <div className="operator-panel">

            <div className="panel-heading">
              <div>
                <span>ATTENTION</span>
                <h3>Operational Alerts</h3>
              </div>

              <div className="alert-count">
                {dashboard?.maintenance_vehicles ?? 0}
              </div>
            </div>

            <div className="operator-alert">

              <div className="alert-icon">
                <FaBell />
              </div>

              <div>
                <strong>
                  Vehicle maintenance required
                </strong>

                <p>
                  TN45TR8343 is currently unavailable.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* VEHICLES */}

        <section className="operator-panel">

          <div className="panel-heading">
            <div>
              <span>VEHICLE STATUS</span>
              <h3>Fleet Visibility</h3>
            </div>
          </div>

          <div className="operator-vehicle-list">

            {operatorVehicles.map((vehicle) => (

              <div
                className="operator-vehicle"
                key={vehicle.id}
              >

                <div className="vehicle-main-icon">
                  <FaTruck />
                </div>

                <div className="vehicle-info">
                  <strong>{vehicle.registration}</strong>
                  <span>
                    <FaMapMarkerAlt />
                    {vehicle.location}
                  </span>
                </div>

                <div
                  className={`vehicle-status ${vehicle.status
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  <FaCircle />
                  {vehicle.status}
                </div>

              </div>

            ))}

          </div>

        </section>

        {/* ACTIVE TRIPS */}

        <section className="operator-panel">

          <div className="panel-heading">
            <div>
              <span>ROUTE MONITORING</span>
              <h3>Current Trips</h3>
            </div>

            <span className="trip-count">
              {activeTrips.length} routes
            </span>
          </div>

          <div className="operator-trips">

            {activeTrips.map((trip) => (

              <div
                className="operator-trip"
                key={trip.id}
              >

                <div className="trip-route-icon">
                  <FaRoute />
                </div>

                <div className="trip-details">

                  <strong>{trip.id}</strong>

                  <span>
                    {trip.route}
                  </span>

                  <small>
                    {trip.vehicle} • {trip.driver}
                  </small>

                </div>

                <div className="trip-status">
                  {trip.status}
                </div>

              </div>

            ))}

          </div>

        </section>

      </main>

    </div>
  );
}

export default OperatorDashboard;