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
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [activeSection, setActiveSection] = useState("operations");

  const loadData = async () => {
    try {
      const dashboardRes = await api.get("/dashboard/");
      setDashboard(dashboardRes.data);

      const activeTripsFromDashboard =
        dashboardRes.data.active_trips || [];

      setTrips(activeTripsFromDashboard);

      setVehicles(
        activeTripsFromDashboard.map((trip) => ({
          id: trip.vehicle_id,
          registration_number:
            trip.vehicle_number ||
            `Vehicle #${trip.vehicle_id}`,
        }))
      );

      setDrivers(
        activeTripsFromDashboard.map((trip) => ({
          id: trip.driver_id,
          name:
            trip.driver_name ||
            `Driver #${trip.driver_id}`,
        }))
      );

      setLastUpdate(new Date());

    } catch (error) {
      console.error(
        "Operator dashboard error:",
        error
      );
    }
  };

  useEffect(() => {
    loadData();

    const interval = setInterval(loadData, 10000);

    return () => clearInterval(interval);
  }, []);

  const refresh = () => {
    loadData();
  };

  const activeTrips = trips.filter(
    (trip) => trip.status === "Active"
  );

  const maintenanceVehicles =
    dashboard?.maintenance_vehicles ?? 0;

  const renderOperations = () => (
    <>
      {/* KPI CARDS */}
      <section className="operator-kpis">

        <div className="operator-kpi">
          <div className="kpi-icon blue">
            <FaTruck />
          </div>

          <div>
            <span>Fleet Vehicles</span>
            <strong>
              {dashboard?.total_vehicles ?? 0}
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
              {dashboard?.available_vehicles ?? 0}
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
            <strong>{activeTrips.length}</strong>
            <small>Currently operating</small>
          </div>
        </div>

        <div className="operator-kpi">
          <div className="kpi-icon red">
            <FaBell />
          </div>

          <div>
            <span>Alerts</span>
            <strong>{maintenanceVehicles}</strong>
            <small>Need attention</small>
          </div>
        </div>

      </section>

      {/* OPERATIONS SUMMARY */}
      <section className="operator-grid">

        {/* ACTIVE TRIPS */}
        <div className="operator-panel">

          <div className="panel-heading">
            <div>
              <span>ROUTE MONITORING</span>
              <h3>Active Trips</h3>
            </div>

            <span className="trip-count">
              {activeTrips.length} active
            </span>
          </div>

          {activeTrips.length === 0 ? (
            <div className="empty-state">
              <FaRoute />

              <strong>
                No active trips
              </strong>

              <span>
                Active assignments will appear here.
              </span>
            </div>
          ) : (
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
                    <strong>
                      TRP-{String(trip.id).padStart(4, "0")}
                    </strong>

                    <span>
                      {trip.source} → {trip.destination}
                    </span>

                    <small>
                      Vehicle #{trip.vehicle_id}
                      {" • "}
                      Driver #{trip.driver_id}
                    </small>
                  </div>

                  <div className="trip-status">
                    ACTIVE
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* ALERT SUMMARY */}
        <div className="operator-panel">

          <div className="panel-heading">
            <div>
              <span>ATTENTION</span>
              <h3>Operational Alerts</h3>
            </div>

            <div className="alert-count">
              {maintenanceVehicles}
            </div>
          </div>

          {maintenanceVehicles > 0 ? (
            <div className="operator-alert">

              <div className="alert-icon">
                <FaBell />
              </div>

              <div>
                <strong>
                  Vehicle maintenance required
                </strong>

                <p>
                  Vehicles currently unavailable.
                </p>
              </div>

            </div>
          ) : (
            <div className="operator-alert">

              <div className="alert-icon">
                <FaCircle />
              </div>

              <div>
                <strong>
                  No active alerts
                </strong>

                <p>
                  Fleet operations are running normally.
                </p>
              </div>

            </div>
          )}

        </div>

      </section>
    </>
  );

  const renderLiveMap = () => (
    <section className="operator-panel">

      <div className="panel-heading">

        <div>
          <span>LIVE TRACKING</span>
          <h3>Fleet Map</h3>
        </div>

        <span className="map-live">
          <FaCircle /> Live
        </span>

      </div>

      <GoogleMap
        trips={activeTrips}
        vehicles={vehicles}
      />

    </section>
  );

  const renderVehicles = () => (
    <section className="operator-panel">

      <div className="panel-heading">
        <div>
          <span>FLEET VISIBILITY</span>
          <h3>Vehicles</h3>
        </div>

        <span className="trip-count">
          {dashboard?.total_vehicles ?? 0} vehicles
        </span>
      </div>

      <div className="operator-trips">

        {dashboard?.total_vehicles ? (
          <>
            <div className="operator-trip">

              <div className="trip-route-icon">
                <FaTruck />
              </div>

              <div className="trip-details">
                <strong>
                  Fleet Overview
                </strong>

                <span>
                  {dashboard.total_vehicles} vehicles registered
                </span>

                <small>
                  {dashboard.available_vehicles ?? 0} available
                  {" • "}
                  {dashboard.maintenance_vehicles ?? 0} maintenance
                </small>
              </div>

              <div className="trip-status">
                MONITORING
              </div>

            </div>

            <div className="operator-trip">

              <div className="trip-route-icon">
                <FaRoute />
              </div>

              <div className="trip-details">
                <strong>
                  Active Fleet
                </strong>

                <span>
                  Vehicles currently assigned to trips
                </span>

                <small>
                  {activeTrips.length} active trip
                  {activeTrips.length === 1 ? "" : "s"}
                </small>
              </div>

              <div className="trip-status">
                LIVE
              </div>

            </div>
          </>
        ) : (
          <div className="empty-state">
            <FaTruck />
            <strong>No vehicle data</strong>
            <span>
              Fleet information is currently unavailable.
            </span>
          </div>
        )}

      </div>

    </section>
  );

  const renderActiveTrips = () => (
    <section className="operator-panel">

      <div className="panel-heading">

        <div>
          <span>ROUTE MONITORING</span>
          <h3>Active Trips</h3>
        </div>

        <span className="trip-count">
          {activeTrips.length} active
        </span>

      </div>

      <div className="operator-trips">

        {activeTrips.length === 0 ? (

          <div className="empty-state">
            <FaRoute />

            <strong>
              No active trips
            </strong>

            <span>
              Active assignments will appear here.
            </span>
          </div>

        ) : (

          activeTrips.map((trip) => {

            const vehicle = vehicles.find(
              (item) =>
                item.id === trip.vehicle_id
            );

            const driver = drivers.find(
              (item) =>
                item.id === trip.driver_id
            );

            return (
              <div
                className="operator-trip"
                key={trip.id}
              >

                <div className="trip-route-icon">
                  <FaRoute />
                </div>

                <div className="trip-details">

                  <strong>
                    TRP-{String(trip.id).padStart(4, "0")}
                  </strong>

                  <span>
                    {trip.source} → {trip.destination}
                  </span>

                  <small>
                    {vehicle?.registration_number ||
                      `Vehicle #${trip.vehicle_id}`}
                    {" • "}
                    {driver?.name ||
                      `Driver #${trip.driver_id}`}
                  </small>

                </div>

                <div className="trip-status">
                  ACTIVE
                </div>

              </div>
            );
          })

        )}

      </div>

    </section>
  );

  const renderAlerts = () => (
    <section className="operator-panel">

      <div className="panel-heading">

        <div>
          <span>ATTENTION</span>
          <h3>Operational Alerts</h3>
        </div>

        <div className="alert-count">
          {maintenanceVehicles}
        </div>

      </div>

      {maintenanceVehicles > 0 ? (

        <div className="operator-alert">

          <div className="alert-icon">
            <FaBell />
          </div>

          <div>
            <strong>
              Vehicle maintenance required
            </strong>

            <p>
              {maintenanceVehicles} vehicle
              {maintenanceVehicles === 1 ? "" : "s"} currently
              unavailable for operations.
            </p>
          </div>

        </div>

      ) : (

        <div className="operator-alert">

          <div className="alert-icon">
            <FaCircle />
          </div>

          <div>
            <strong>
              No active alerts
            </strong>

            <p>
              Fleet operations are running normally.
            </p>
          </div>

        </div>

      )}

    </section>
  );

  const sectionTitles = {
    operations: {
      title: "Live Operations",
      description:
        "Monitor vehicles and active fleet movements.",
    },

    map: {
      title: "Live Map",
      description:
        "Track active vehicles and their current movements.",
    },

    vehicles: {
      title: "Vehicles",
      description:
        "Monitor fleet availability and operational status.",
    },

    trips: {
      title: "Active Trips",
      description:
        "Monitor currently active fleet assignments.",
    },

    alerts: {
      title: "Alerts",
      description:
        "Review operational issues requiring attention.",
    },
  };

  const currentPage = sectionTitles[activeSection];

  return (
    <div className="operator-dashboard">

      {/* SIDEBAR */}

      <aside className="operator-sidebar">

        <div className="operator-brand">

          <div className="operator-brand-icon">
            <FaTruck />
          </div>

          <div>
            <h1>FleetCommand</h1>
            <span>Fleet Operations</span>
          </div>

        </div>

        <div className="operator-role">

          <small>LOGGED IN AS</small>

          <strong>
            Logistics Operator
          </strong>

        </div>

        <div className="operator-nav-title">
          OPERATIONS
        </div>

        <nav>

          <div
            className={`operator-nav ${
              activeSection === "operations"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("operations")
            }
          >
            <FaRoute />
            Operations
          </div>

          <div
            className={`operator-nav ${
              activeSection === "map"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("map")
            }
          >
            <FaMapMarkerAlt />
            Live Map
          </div>

          <div
            className={`operator-nav ${
              activeSection === "vehicles"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("vehicles")
            }
          >
            <FaTruck />
            Vehicles
          </div>

          <div
            className={`operator-nav ${
              activeSection === "trips"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("trips")
            }
          >
            <FaRoute />
            Active Trips
          </div>

          <div
            className={`operator-nav ${
              activeSection === "alerts"
                ? "active"
                : ""
            }`}
            onClick={() =>
              setActiveSection("alerts")
            }
          >
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

            <span>
              FLEET OPERATIONS / TRACKING
            </span>

            <h2>
              {currentPage.title}
            </h2>

            <p>
              {currentPage.description}
            </p>

          </div>

          <div className="operator-header-right">

            <div className="live-status">
              <FaCircle />
              LIVE
            </div>

            <small>
              Last update{" "}
              {lastUpdate.toLocaleTimeString()}
            </small>

            <button
              onClick={refresh}
              className="refresh-btn"
            >
              <FaSyncAlt />
            </button>

          </div>

        </header>

        {/* ONLY ONE SECTION IS RENDERED */}

        {activeSection === "operations" &&
          renderOperations()}

        {activeSection === "map" &&
          renderLiveMap()}

        {activeSection === "vehicles" &&
          renderVehicles()}

        {activeSection === "trips" &&
          renderActiveTrips()}

        {activeSection === "alerts" &&
          renderAlerts()}

      </main>

    </div>
  );
}

export default OperatorDashboard;