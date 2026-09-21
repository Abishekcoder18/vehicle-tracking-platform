import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import "../App.css";
import GoogleMap from "../components/GoogleMap";
import OperatorDashboard from "./OperatorDashboard";

import {
  FaBell,
  FaCar,
  FaCheckCircle,
  FaClipboardList,
  FaCog,
  FaExclamationTriangle,
  FaMapMarkedAlt,
  FaRoute,
  FaSignOutAlt,
  FaTools,
  FaTruck,
  FaUserTie,
  FaUsers,
  FaBars,
  FaTimes,
  FaPlus,
  FaEye,
  FaArrowRight,
  FaCircle,
} from "react-icons/fa";

function Dashboard() {
  // =====================================================
  // OPERATOR ROLE CHECK — Must be before any hooks
  // =====================================================

  const storedRole = localStorage.getItem("role");

  if (storedRole === "OPERATOR") {
    return <OperatorDashboard />;
  }

  // =====================================================
  // MANAGER DASHBOARD (existing logic unchanged)
  // =====================================================

  const [activeSection, setActiveSection] = useState("overview");
  const [mobileMenu, setMobileMenu] = useState(false);

  const [role, setRole] = useState("FLEET_MANAGER");

  const [dashboard, setDashboard] = useState({
    total_vehicles: 0,
    available_vehicles: 0,
    running_vehicles: 0,
    maintenance_vehicles: 0,
    total_trips: 0,
    pending_trips: 0,
    running_trips: 0,
    completed_trips: 0,
  });

  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [drivers, setDrivers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const [vehicleForm, setVehicleForm] = useState({
    registration_number: "",
    model: "",
    vehicle_type: "",
    status: "Available",
  });

  const [tripForm, setTripForm] = useState({
    source: "",
    destination: "",
    driver_id: "",
    vehicle_id: "",
    status: "Pending",
  });

  const [editingVehicleId, setEditingVehicleId] = useState(null);

  const getRoleFromToken = () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return "FLEET_MANAGER";

      const payload = JSON.parse(atob(token.split(".")[1]));

      return payload.role || "FLEET_MANAGER";
    } catch {
      return "FLEET_MANAGER";
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const dashboardRes = await api.get("/dashboard/");

      setDashboard(dashboardRes.data);

      const currentRole = getRoleFromToken();
      setRole(currentRole);

      if (currentRole === "FLEET_MANAGER" || currentRole === "ADMIN") {
        const [vehicleRes, tripRes] = await Promise.all([
          api.get("/vehicles/"),
          api.get("/trips/"),
        ]);

        setVehicles(vehicleRes.data);
        setTrips(tripRes.data);

        /*
         * Driver endpoint may not be available in every current backend
         * version. We keep the UI ready and fall back safely.
         */
        try {
          const driverRes = await api.get("/drivers/");
          setDrivers(driverRes.data);
        } catch {
          setDrivers([]);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load fleet data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  const isManager = role === "FLEET_MANAGER" || role === "ADMIN";

  const navigation = isManager
    ? [
        { id: "overview", label: "Overview", icon: FaClipboardList },
        { id: "vehicles", label: "Vehicles", icon: FaTruck },
        { id: "drivers", label: "Drivers", icon: FaUsers },
        { id: "trips", label: "Trips", icon: FaRoute },
        { id: "assignments", label: "Assignments", icon: FaArrowRight },
        { id: "alerts", label: "Alerts", icon: FaBell },
      ]
    : [
        { id: "overview", label: "Live Operations", icon: FaClipboardList },
        { id: "map", label: "Live Map", icon: FaMapMarkedAlt },
        { id: "vehicles", label: "Vehicles", icon: FaTruck },
        { id: "trips", label: "Active Trips", icon: FaRoute },
        { id: "alerts", label: "Alerts", icon: FaBell },
      ];

  const statusClass = (status) => {
    if (!status) return "neutral";

    return status
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace("on-trip", "on-trip");
  };

  const createVehicle = async (e) => {
    e.preventDefault();

    try {
      if (editingVehicleId) {
        await api.put(`/vehicles/${editingVehicleId}`, vehicleForm);
      } else {
        await api.post("/vehicles/", vehicleForm);
      }

      setVehicleForm({
        registration_number: "",
        model: "",
        vehicle_type: "",
        status: "Available",
      });

      setEditingVehicleId(null);
      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Unable to save vehicle."
      );
    }
  };

  const startEditVehicle = (vehicle) => {
    setVehicleForm({
      registration_number: vehicle.registration_number || "",
      model: vehicle.model || "",
      vehicle_type: vehicle.vehicle_type || "",
      status: vehicle.status || "Available",
    });

    setEditingVehicleId(vehicle.id);
    setActiveSection("vehicles");
  };

  const deleteVehicle = async (id) => {
    if (!window.confirm("Delete this vehicle?")) return;

    try {
      await api.delete(`/vehicles/${id}`);
      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Unable to delete vehicle."
      );
    }
  };

  const createTrip = async (e) => {
    e.preventDefault();

    if (!tripForm.driver_id || !tripForm.vehicle_id) {
      alert("Select both a driver and a vehicle.");
      return;
    }

    try {
      await api.post("/trips/", {
        source: tripForm.source,
        destination: tripForm.destination,
        driver_id: Number(tripForm.driver_id),
        vehicle_id: Number(tripForm.vehicle_id),
        status: tripForm.status,
      });

      setTripForm({
        source: "",
        destination: "",
        driver_id: "",
        vehicle_id: "",
        status: "Pending",
      });

      await loadData();
      setActiveSection("trips");
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Unable to create trip."
      );
    }
  };

  const updateTripStatus = async (trip, newStatus) => {
    try {
      await api.put(`/trips/${trip.id}`, {
        source: trip.source,
        destination: trip.destination,
        driver_id: trip.driver_id,
        vehicle_id: trip.vehicle_id,
        status: newStatus,
      });

      await loadData();
    } catch (err) {
      alert(
        err.response?.data?.detail ||
          "Unable to update trip."
      );
    }
  };

  const vehicleById = useMemo(() => {
    return Object.fromEntries(
      vehicles.map((vehicle) => [vehicle.id, vehicle])
    );
  }, [vehicles]);

  const driverById = useMemo(() => {
    return Object.fromEntries(
      drivers.map((driver) => [driver.id, driver])
    );
  }, [drivers]);

  const activeTrips = trips.filter(
    (trip) => trip.status === "Active"
  );

  const attentionItems = [
    dashboard.maintenance_vehicles > 0 && {
      type: "maintenance",
      icon: FaTools,
      title: `${dashboard.maintenance_vehicles} vehicle${
        dashboard.maintenance_vehicles > 1 ? "s" : ""
      } in maintenance`,
      text: "Review vehicle availability before assigning new trips.",
    },
    dashboard.pending_trips > 0 && {
      type: "pending",
      icon: FaExclamationTriangle,
      title: `${dashboard.pending_trips} pending trip${
        dashboard.pending_trips > 1 ? "s" : ""
      }`,
      text: "Pending trips are waiting for operational action.",
    },
    dashboard.running_vehicles > 0 && {
      type: "active",
      icon: FaRoute,
      title: `${dashboard.running_vehicles} vehicle${
        dashboard.running_vehicles > 1 ? "s" : ""
      } currently on trip`,
      text: "Monitor active operations from the live view.",
    },
  ].filter(Boolean);

  const renderHeader = () => (
    <header className="command-header">
      <div className="header-title">
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? <FaTimes /> : <FaBars />}
        </button>

        <div>
          <div className="eyebrow">
            FLEET OPERATIONS / {isManager ? "MANAGEMENT" : "TRACKING"}
          </div>

          <h1>
            {activeSection === "overview"
              ? isManager
                ? "Fleet Overview"
                : "Live Operations"
              : navigation.find(
                    (item) => item.id === activeSection
                  )?.label}
          </h1>

          <p>
            {isManager
              ? "Manage vehicles, drivers and daily fleet operations."
              : "Monitor active vehicles and trips in real time."}
          </p>
        </div>
      </div>

      <div className="header-actions">
        <div className="live-indicator">
          <FaCircle />
          <span>LIVE</span>
        </div>

        <div className="last-update">
          Last update{" "}
          {new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </div>

        <button
          className="refresh-button"
          onClick={loadData}
          title="Refresh"
        >
          ↻
        </button>
      </div>
    </header>
  );

  const renderSidebar = () => (
    <aside className={`sidebar ${mobileMenu ? "mobile-open" : ""}`}>
      <div className="brand">
        <div className="brand-icon">
          <FaTruck />
        </div>

        <div>
          <h1>FleetCommand</h1>
          <span>Fleet Operations</span>
        </div>
      </div>

      <div className="role-card">
        <div className="role-avatar">
          {isManager ? <FaUserTie /> : <FaMapMarkedAlt />}
        </div>

        <div>
          <small>LOGGED IN AS</small>
          <strong>
            {isManager
              ? "Fleet Manager"
              : "Logistics Operator"}
          </strong>
        </div>
      </div>

      <div className="nav-section-label">WORKSPACE</div>

      <nav className="sidebar-nav">
        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              className={`nav-item ${
                activeSection === item.id ? "active" : ""
              }`}
              onClick={() => {
                setActiveSection(item.id);
                setMobileMenu(false);
              }}
            >
              <Icon />
              <span>{item.label}</span>

              {item.id === "alerts" &&
                attentionItems.length > 0 && (
                  <span className="nav-count">
                    {attentionItems.length}
                  </span>
                )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <button
          className="nav-item"
          onClick={() => setActiveSection("settings")}
        >
          <FaCog />
          <span>Settings</span>
        </button>

        <button className="logout-sidebar" onClick={logout}>
          <FaSignOutAlt />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );

  const renderKpis = () => (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon blue">
          <FaTruck />
        </div>

        <div>
          <span>Total Vehicles</span>
          <strong>{dashboard.total_vehicles}</strong>
          <small>Fleet capacity</small>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon green">
          <FaCheckCircle />
        </div>

        <div>
          <span>Available</span>
          <strong>{dashboard.available_vehicles}</strong>
          <small>Ready for assignment</small>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon amber">
          <FaRoute />
        </div>

        <div>
          <span>On Trip</span>
          <strong>{dashboard.running_vehicles}</strong>
          <small>Currently operating</small>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon red">
          <FaTools />
        </div>

        <div>
          <span>Maintenance</span>
          <strong>{dashboard.maintenance_vehicles}</strong>
          <small>Needs attention</small>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => (
    <>
      {renderKpis()}

      <div className="dashboard-grid">
        <section className="panel map-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">LIVE OPERATIONS</span>
              <h2>Fleet Map</h2>
            </div>

            <button
              className="text-button"
              onClick={() => setActiveSection("map")}
            >
              Open live map <FaArrowRight />
            </button>
          </div>

          <div className="map-wrapper">
            <GoogleMap
              trips={trips}
              vehicles={vehicles}
            />
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">ATTENTION</span>
              <h2>Operational Alerts</h2>
            </div>

            <span className="alert-number">
              {attentionItems.length}
            </span>
          </div>

          <div className="alert-list">
            {attentionItems.length === 0 ? (
              <div className="empty-state compact">
                <FaCheckCircle />
                <strong>All clear</strong>
                <span>No operational issues detected.</span>
              </div>
            ) : (
              attentionItems.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    className={`alert-item ${item.type}`}
                    key={index}
                  >
                    <div className="alert-icon">
                      <Icon />
                    </div>

                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.text}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      <div className="dashboard-grid bottom-grid">
        <section className="panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">ACTIVE ROUTES</span>
              <h2>Current Trips</h2>
            </div>

            <button
              className="text-button"
              onClick={() => setActiveSection("trips")}
            >
              View all <FaArrowRight />
            </button>
          </div>

          {activeTrips.length === 0 ? (
            <div className="empty-state">
              <FaRoute />
              <strong>No active trips</strong>
              <span>There are no vehicles currently marked as active.</span>
            </div>
          ) : (
            <div className="trip-list">
              {activeTrips.slice(0, 5).map((trip) => (
                <div className="trip-row" key={trip.id}>
                  <div className="trip-id">
                    <span>TRP-{String(trip.id).padStart(4, "0")}</span>
                    <small>ACTIVE</small>
                  </div>

                  <div className="trip-route">
                    <strong>{trip.source}</strong>
                    <FaArrowRight />
                    <strong>{trip.destination}</strong>
                  </div>

                  <button
                    className="icon-button"
                    onClick={() => {
                      setSelectedTrip(trip);
                    }}
                  >
                    <FaEye />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel fleet-status-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">FLEET HEALTH</span>
              <h2>Vehicle Status</h2>
            </div>
          </div>

          <div className="status-bars">
            <StatusBar
              label="Available"
              value={dashboard.available_vehicles}
              total={dashboard.total_vehicles}
              className="available"
            />

            <StatusBar
              label="On Trip"
              value={dashboard.running_vehicles}
              total={dashboard.total_vehicles}
              className="active"
            />

            <StatusBar
              label="Maintenance"
              value={dashboard.maintenance_vehicles}
              total={dashboard.total_vehicles}
              className="maintenance"
            />
          </div>

          <div className="fleet-summary">
            <div>
              <span>Trips today</span>
              <strong>{dashboard.total_trips}</strong>
            </div>

            <div>
              <span>Completed</span>
              <strong>{dashboard.completed_trips}</strong>
            </div>
          </div>
        </section>
      </div>
    </>
  );

  const renderVehicles = () => (
    <>
      <div className="section-intro">
        <div>
          <span className="panel-label">
            {isManager ? "FLEET MANAGEMENT" : "FLEET MONITORING"}
          </span>

          <h2>
            {isManager
              ? "Vehicle Management"
              : "Vehicle Operations"}
          </h2>

          <p>
            {isManager
              ? "Manage fleet assets and operational availability."
              : "Monitor the current operational state of fleet vehicles."}
          </p>
        </div>

        {isManager && (
          <button
            className="primary-button"
            onClick={() => {
              setEditingVehicleId(null);
              setVehicleForm({
                registration_number: "",
                model: "",
                vehicle_type: "",
                status: "Available",
              });
            }}
          >
            <FaPlus /> Add Vehicle
          </button>
        )}
      </div>

      {isManager && (
        <section className="panel form-panel">
          <div className="panel-header">
            <div>
              <span className="panel-label">
                {editingVehicleId ? "EDIT VEHICLE" : "NEW VEHICLE"}
              </span>

              <h2>
                {editingVehicleId
                  ? "Update vehicle"
                  : "Register vehicle"}
              </h2>
            </div>
          </div>

          <form className="modern-form" onSubmit={createVehicle}>
            <div className="input-group">
              <label>Registration Number</label>
              <input
                value={vehicleForm.registration_number}
                onChange={(e) =>
                  setVehicleForm({
                    ...vehicleForm,
                    registration_number: e.target.value,
                  })
                }
                placeholder="TN 45 TR 8343"
                required
              />
            </div>

            <div className="input-group">
              <label>Model</label>
              <input
                value={vehicleForm.model}
                onChange={(e) =>
                  setVehicleForm({
                    ...vehicleForm,
                    model: e.target.value,
                  })
                }
                placeholder="Vehicle model"
                required
              />
            </div>

            <div className="input-group">
              <label>Vehicle Type</label>
              <select
                value={vehicleForm.vehicle_type}
                onChange={(e) =>
                  setVehicleForm({
                    ...vehicleForm,
                    vehicle_type: e.target.value,
                  })
                }
                required
              >
                <option value="">Select vehicle type</option>
                <option value="Car">Car</option>
                <option value="Truck">Truck</option>
                <option value="Sedan">Sedan</option>
              </select>
            </div>

            <div className="input-group">
              <label>Status</label>
              <select
                value={vehicleForm.status}
                onChange={(e) =>
                  setVehicleForm({
                    ...vehicleForm,
                    status: e.target.value,
                  })
                }
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="form-actions">
              {editingVehicleId && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    setEditingVehicleId(null);
                    setVehicleForm({
                      registration_number: "",
                      model: "",
                      vehicle_type: "",
                      status: "Available",
                    });
                  }}
                >
                  Cancel
                </button>
              )}

              <button className="primary-button" type="submit">
                {editingVehicleId
                  ? "Save Changes"
                  : "Register Vehicle"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">FLEET</span>
            <h2>Vehicle List</h2>
          </div>

          <span className="record-count">
            {vehicles.length} vehicles
          </span>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Status</th>
                <th>Current Operation</th>
                {isManager && <th>Actions</th>}
              </tr>
            </thead>

            <tbody>
              {vehicles.map((vehicle) => {
                const vehicleTrip = trips.find(
                  (trip) =>
                    trip.vehicle_id === vehicle.id &&
                    trip.status === "Active"
                );

                return (
                  <tr key={vehicle.id}>
                    <td>
                      <div className="vehicle-cell">
                        <div className="vehicle-mini-icon">
                          <FaTruck />
                        </div>

                        <div>
                          <strong>
                            {vehicle.registration_number}
                          </strong>
                          <span>{vehicle.model}</span>
                        </div>
                      </div>
                    </td>

                    <td>{vehicle.vehicle_type}</td>

                    <td>
                      <StatusBadge status={vehicle.status} />
                    </td>

                    <td>
                      {vehicleTrip ? (
                        <div className="operation-cell">
                          <strong>
                            {vehicleTrip.source} →{" "}
                            {vehicleTrip.destination}
                          </strong>
                          <span>
                            Trip #
                            {String(vehicleTrip.id).padStart(
                              4,
                              "0"
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="muted">
                          No active trip
                        </span>
                      )}
                    </td>

                    {isManager && (
                      <td>
                        <div className="table-actions">
                          <button
                            className="table-action"
                            onClick={() =>
                              startEditVehicle(vehicle)
                            }
                            title="Edit"
                          >
                            Edit
                          </button>

                          <button
                            className="table-action danger"
                            onClick={() =>
                              deleteVehicle(vehicle.id)
                            }
                            title="Delete"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>

          {vehicles.length === 0 && (
            <div className="empty-state">
              <FaTruck />
              <strong>No vehicle records</strong>
              <span>
                Vehicle data will appear here when available.
              </span>
            </div>
          )}
        </div>
      </section>
    </>
  );

  const renderDrivers = () => (
    <section className="panel">
      <div className="section-intro inside">
        <div>
          <span className="panel-label">DRIVER MANAGEMENT</span>
          <h2>Driver Operations</h2>
          <p>
            Monitor driver availability and current assignments.
          </p>
        </div>

        <span className="record-count">
          {drivers.length} drivers
        </span>
      </div>

      {drivers.length === 0 ? (
        <div className="empty-state large">
          <FaUsers />
          <strong>Driver data is not available</strong>
          <span>
            The current dashboard will display driver records
            automatically when the driver API is available.
          </span>
        </div>
      ) : (
        <div className="driver-grid">
          {drivers.map((driver) => (
            <div className="driver-card" key={driver.id}>
              <div className="driver-avatar">
                <FaUserTie />
              </div>

              <div className="driver-info">
                <strong>
                  {driver.name ||
                    driver.driver_name ||
                    `Driver #${driver.id}`}
                </strong>

                <span>
                  {driver.license_number ||
                    "Licensed fleet driver"}
                </span>

                <StatusBadge
                  status={driver.status || "Available"}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  const renderTrips = () => (
    <>
      <div className="section-intro">
        <div>
          <span className="panel-label">TRIP OPERATIONS</span>
          <h2>
            {isManager ? "Trip Management" : "Active Trips"}
          </h2>

          <p>
            {isManager
              ? "Create, monitor and control fleet trips."
              : "Monitor your current fleet movement and routes."}
          </p>
        </div>

        {isManager && (
          <button
            className="primary-button"
            onClick={() => setActiveSection("assignments")}
          >
            <FaPlus /> Create Trip
          </button>
        )}
      </div>

      <section className="panel">
        <div className="trip-stats">
          <MiniStat
            label="Total Trips"
            value={dashboard.total_trips}
          />

          <MiniStat
            label="Pending"
            value={dashboard.pending_trips}
          />

          <MiniStat
            label="Active"
            value={dashboard.running_trips}
          />

          <MiniStat
            label="Completed"
            value={dashboard.completed_trips}
          />
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <span className="panel-label">ROUTE REGISTER</span>
            <h2>Trip List</h2>
          </div>

          <span className="record-count">
            {trips.length} trips
          </span>
        </div>

        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Trip</th>
                <th>Route</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Status</th>
                {isManager && <th>Action</th>}
              </tr>
            </thead>

            <tbody>
              {trips.map((trip) => {
                const vehicle = vehicleById[trip.vehicle_id];
                const driver = driverById[trip.driver_id];

                return (
                  <tr key={trip.id}>
                    <td>
                      <strong className="trip-number">
                        TRP-
                        {String(trip.id).padStart(4, "0")}
                      </strong>
                    </td>

                    <td>
                      <div className="route-cell">
                        <strong>{trip.source}</strong>
                        <FaArrowRight />
                        <strong>{trip.destination}</strong>
                      </div>
                    </td>

                    <td>
                      {vehicle?.registration_number ||
                        `Vehicle #${trip.vehicle_id}`}
                    </td>

                    <td>
                      {driver?.name ||
                        driver?.driver_name ||
                        `Driver #${trip.driver_id}`}
                    </td>

                    <td>
                      <StatusBadge status={trip.status} />
                    </td>

                    {isManager && (
                      <td>
                        {trip.status === "Pending" && (
                          <button
                            className="table-action success"
                            onClick={() =>
                              updateTripStatus(
                                trip,
                                "Active"
                              )
                            }
                          >
                            Start
                          </button>
                        )}

                        {trip.status === "Active" && (
                          <button
                            className="table-action success"
                            onClick={() =>
                              updateTripStatus(
                                trip,
                                "Completed"
                              )
                            }
                          >
                            Complete
                          </button>
                        )}

                        {trip.status === "Completed" && (
                          <span className="muted">
                            Closed
                          </span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );

  const renderAssignments = () => (
    <section className="panel assignment-panel">
      <div className="section-intro inside">
        <div>
          <span className="panel-label">
            OPERATIONAL ASSIGNMENT
          </span>
          <h2>Create a New Trip</h2>
          <p>
            Assign an available vehicle and driver to a route.
          </p>
        </div>
      </div>

      <form className="assignment-form" onSubmit={createTrip}>
        <div className="route-input">
          <span>01</span>

          <div className="input-group">
            <label>Origin</label>
            <input
              value={tripForm.source}
              onChange={(e) =>
                setTripForm({
                  ...tripForm,
                  source: e.target.value,
                })
              }
              placeholder="Chennai"
              required
            />
          </div>
        </div>

        <div className="route-line"></div>

        <div className="route-input">
          <span>02</span>

          <div className="input-group">
            <label>Destination</label>
            <input
              value={tripForm.destination}
              onChange={(e) =>
                setTripForm({
                  ...tripForm,
                  destination: e.target.value,
                })
              }
              placeholder="Trichy"
              required
            />
          </div>
        </div>

        <div className="assignment-grid">
          <div className="input-group">
            <label>Vehicle</label>

            <select
              value={tripForm.vehicle_id}
              onChange={(e) =>
                setTripForm({
                  ...tripForm,
                  vehicle_id: e.target.value,
                })
              }
              required
            >
              <option value="">Select available vehicle</option>

              {vehicles
                .filter(
                  (vehicle) =>
                    vehicle.status === "Available"
                )
                .map((vehicle) => (
                  <option
                    key={vehicle.id}
                    value={vehicle.id}
                  >
                    {vehicle.registration_number} —{" "}
                    {vehicle.model}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-group">
            <label>Driver</label>

            <select
              value={tripForm.driver_id}
              onChange={(e) =>
                setTripForm({
                  ...tripForm,
                  driver_id: e.target.value,
                })
              }
              required
            >
              <option value="">Select available driver</option>

              {drivers
                .filter(
                  (driver) =>
                    !driver.status ||
                    driver.status === "Available"
                )
                .map((driver) => (
                  <option
                    key={driver.id}
                    value={driver.id}
                  >
                    {driver.name ||
                      driver.driver_name ||
                      `Driver #${driver.id}`}
                  </option>
                ))}
            </select>
          </div>

          <div className="input-group">
            <label>Initial Status</label>

            <select
              value={tripForm.status}
              onChange={(e) =>
                setTripForm({
                  ...tripForm,
                  status: e.target.value,
                })
              }
            >
              <option value="Pending">Pending</option>
              <option value="Active">Start Immediately</option>
            </select>
          </div>
        </div>

        <div className="assignment-summary">
          <div>
            <FaRoute />
            <div>
              <span>Route</span>
              <strong>
                {tripForm.source || "Origin"} →{" "}
                {tripForm.destination || "Destination"}
              </strong>
            </div>
          </div>

          <button className="primary-button" type="submit">
            <FaCheckCircle />
            Create Assignment
          </button>
        </div>
      </form>
    </section>
  );

  const renderAlerts = () => (
    <section className="panel">
      <div className="section-intro inside">
        <div>
          <span className="panel-label">OPERATIONS CENTER</span>
          <h2>Alerts & Attention</h2>
          <p>
            Operational items that may require fleet manager
            attention.
          </p>
        </div>
      </div>

      <div className="alert-list full">
        {attentionItems.length === 0 ? (
          <div className="empty-state large">
            <FaCheckCircle />
            <strong>No active alerts</strong>
            <span>
              Fleet operations are currently clear.
            </span>
          </div>
        ) : (
          attentionItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                className={`alert-item large ${item.type}`}
                key={index}
              >
                <div className="alert-icon">
                  <Icon />
                </div>

                <div>
                  <strong>{item.title}</strong>
                  <span>{item.text}</span>
                </div>

                <button
                  className="text-button"
                  onClick={() =>
                    item.type === "maintenance"
                      ? setActiveSection("vehicles")
                      : setActiveSection(
                          item.type === "pending"
                            ? "trips"
                            : "overview"
                        )
                  }
                >
                  Review <FaArrowRight />
                </button>
              </div>
            );
          })
        )}
      </div>
    </section>
  );

  const renderMap = () => (
    <section className="panel map-page">
      <div className="section-intro inside">
        <div>
          <span className="panel-label">REAL-TIME TRACKING</span>
          <h2>Live Fleet Map</h2>
          <p>
            Monitor current fleet positions and active routes.
          </p>
        </div>

        <div className="live-indicator dark">
          <FaCircle />
          LIVE
        </div>
      </div>

      <div className="large-map">
        <GoogleMap
          trips={trips}
          vehicles={vehicles}
        />
      </div>

      <div className="map-footer">
        <div>
          <span>Vehicles visible</span>
          <strong>{vehicles.length}</strong>
        </div>

        <div>
          <span>Active trips</span>
          <strong>{activeTrips.length}</strong>
        </div>

        <div>
          <span>Last synchronization</span>
          <strong>
            {new Date().toLocaleTimeString()}
          </strong>
        </div>
      </div>
    </section>
  );

  const renderSettings = () => (
    <section className="panel">
      <div className="section-intro inside">
        <div>
          <span className="panel-label">SYSTEM</span>
          <h2>Settings</h2>
          <p>FleetCommand dashboard configuration.</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <FaBell />
          <div>
            <strong>Operational Alerts</strong>
            <span>Enabled</span>
          </div>
        </div>

        <div className="setting-card">
          <FaMapMarkedAlt />
          <div>
            <strong>Live Tracking</strong>
            <span>Enabled</span>
          </div>
        </div>

        <div className="setting-card">
          <FaClipboardList />
          <div>
            <strong>Role</strong>
            <span>
              {isManager
                ? "Fleet Manager"
                : "Logistics Operator"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
          <strong>Loading fleet operations...</strong>
          <span>Connecting to fleet services</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-panel">
          <FaExclamationTriangle />
          <h2>Unable to load operations</h2>
          <p>{error}</p>
          <button className="primary-button" onClick={loadData}>
            Retry
          </button>
        </div>
      );
    }

    switch (activeSection) {
      case "vehicles":
        return renderVehicles();

      case "drivers":
        return renderDrivers();

      case "trips":
        return renderTrips();

      case "assignments":
        return renderAssignments();

      case "alerts":
        return renderAlerts();

      case "map":
        return renderMap();

      case "settings":
        return renderSettings();

      default:
        return renderOverview();
    }
  };

  return (
    <div className="app-shell">
      {renderSidebar()}

      <main className="main-content">
        {renderHeader()}

        <div className="content-area">
          {renderContent()}
        </div>
      </main>

      {selectedTrip && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedTrip(null)}
        >
          <div
            className="detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="panel-label">
                  TRIP DETAILS
                </span>

                <h2>
                  TRP-
                  {String(selectedTrip.id).padStart(
                    4,
                    "0"
                  )}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedTrip(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="detail-route">
              <strong>{selectedTrip.source}</strong>
              <FaArrowRight />
              <strong>{selectedTrip.destination}</strong>
            </div>

            <div className="detail-grid">
              <DetailItem
                label="Status"
                value={selectedTrip.status}
              />

              <DetailItem
                label="Vehicle"
                value={
                  vehicleById[selectedTrip.vehicle_id]
                    ?.registration_number ||
                  `Vehicle #${selectedTrip.vehicle_id}`
                }
              />

              <DetailItem
                label="Driver"
                value={
                  driverById[selectedTrip.driver_id]
                    ?.name ||
                  driverById[selectedTrip.driver_id]
                    ?.driver_name ||
                  `Driver #${selectedTrip.driver_id}`
                }
              />

              <DetailItem
                label="Trip ID"
                value={`#${selectedTrip.id}`}
              />
            </div>
          </div>
        </div>
      )}

      {selectedVehicle && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedVehicle(null)}
        >
          <div
            className="detail-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <span className="panel-label">
                  VEHICLE DETAILS
                </span>

                <h2>
                  {selectedVehicle.registration_number}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setSelectedVehicle(null)}
              >
                <FaTimes />
              </button>
            </div>

            <div className="detail-grid">
              <DetailItem
                label="Model"
                value={selectedVehicle.model}
              />

              <DetailItem
                label="Type"
                value={selectedVehicle.vehicle_type}
              />

              <DetailItem
                label="Status"
                value={selectedVehicle.status}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  return (
    <span className={`status-pill ${statusClassLocal(status)}`}>
      <span></span>
      {status || "Unknown"}
    </span>
  );
}

function statusClassLocal(status) {
  if (!status) return "neutral";

  return status
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function StatusBar({
  label,
  value,
  total,
  className,
}) {
  const percentage =
    total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <div className="status-bar">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

      <div className="bar-track">
        <div
          className={`bar-fill ${className}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="mini-stat">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export default Dashboard;