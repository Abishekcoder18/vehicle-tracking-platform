import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";
import Navbar from "../components/Navbar";
import GoogleMap from "../components/GoogleMap";
import { FaTruck, FaRoute, FaEdit, FaTrash } from "react-icons/fa";

function Dashboard() {
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

  const [vehicle, setVehicle] = useState({
    registration_number: "",
    model: "",
    vehicle_type: "",
    status: "Available",
  });

  const [trip, setTrip] = useState({
    source: "",
    destination: "",
    driver_name: "",
    vehicle_number: "",
    status: "Pending",
  });

  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [editingTripId, setEditingTripId] = useState(null);

  const loadData = async () => {
    const dashboardRes = await api.get("/dashboard/");
    const vehicleRes = await api.get("/vehicles/");
    const tripRes = await api.get("/trips/");

    setDashboard(dashboardRes.data);
    setVehicles(vehicleRes.data);
    setTrips(tripRes.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addVehicle = async () => {
    if (editingVehicleId) {
      await api.put(`/vehicles/${editingVehicleId}`, vehicle);
      setEditingVehicleId(null);
    } else {
      await api.post("/vehicles/", vehicle);
    }

    setVehicle({
      registration_number: "",
      model: "",
      vehicle_type: "",
      status: "Available",
    });

    loadData();
  };

  const editVehicle = (v) => {
    console.log("Edit clicked:", v);

    setVehicle({
      registration_number: v.registration_number,
      model: v.model,
      vehicle_type: v.vehicle_type,
      status: v.status,
    });

    setEditingVehicleId(v.id);
  };

  const addTrip = async () => {
    if (editingTripId) {
      await api.put(`/trips/${editingTripId}`, trip);
      setEditingTripId(null);
    } else {
      await api.post("/trips/", trip);
    }

    setTrip({
      source: "",
      destination: "",
      driver_name: "",
      vehicle_number: "",
      status: "Pending",
    });

    loadData();
  };

  const editTrip = (t) => {
    setTrip({
      source: t.source,
      destination: t.destination,
      driver_name: t.driver_name,
      vehicle_number: t.vehicle_number,
      status: t.status || "Pending",
    });

    setEditingTripId(t.id);
  };

  return (
    <>
      <Navbar />

      <div className="container">

        <div className="section">
          <h2>Dashboard</h2>

          <div className="cards">
            <div className="card">
              <div className="card-header">
                <FaTruck className="card-icon" />
                <span>Total Vehicles</span>
              </div>
              <h1>{dashboard.total_vehicles}</h1>
            </div>

            <div className="card">
              <div className="card-header">
                <FaTruck className="card-icon" />
                <span>Available Vehicles</span>
              </div>
              <h1>{dashboard.available_vehicles}</h1>
            </div>

            <div className="card">
              <div className="card-header">
                <FaTruck className="card-icon" />
                <span>Running Vehicles</span>
              </div>
              <h1>{dashboard.running_vehicles}</h1>
            </div>

            <div className="card">
              <div className="card-header">
                <FaTruck className="card-icon" />
                <span>Maintenance Vehicles</span>
              </div>
              <h1>{dashboard.maintenance_vehicles}</h1>
            </div>

            <div className="card">
              <div className="card-header">
                <FaRoute className="card-icon" />
                <span>Total Trips</span>
              </div>
              <h1>{dashboard.total_trips}</h1>
            </div>

            <div className="card">
              <div className="card-header">
                <FaRoute className="card-icon" />
                <span>Pending Trips</span>
              </div>
              <h1>{dashboard.pending_trips}</h1>
            </div>

            <div className="card">
              <div className="card-header">
                <FaRoute className="card-icon" />
                <span>Running Trips</span>
              </div>
              <h1>{dashboard.running_trips}</h1>
            </div>

            <div className="card">
              <div className="card-header">
                <FaRoute className="card-icon" />
                <span>Completed Trips</span>
              </div>
              <h1>{dashboard.completed_trips}</h1>
            </div>
          </div>
        </div>

        <div style={{ height: "10px" }}></div>

        <div className="section">
          <h2>Vehicle Management</h2>

          <div className="form-grid">
            <div>
              <label>Registration Number</label>
              <input
                placeholder="Enter Registration Number"
                value={vehicle.registration_number}
                onChange={(e) =>
                  setVehicle({
                    ...vehicle,
                    registration_number: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label>Vehicle Model</label>
              <input
                placeholder="Enter Vehicle Model"
                value={vehicle.model}
                onChange={(e) =>
                  setVehicle({
                    ...vehicle,
                    model: e.target.value,
                  })
                }
              />
            </div>

            <div className="full">
              <label>Vehicle Type</label>
              <input
                placeholder="Enter Vehicle Type"
                value={vehicle.vehicle_type}
                onChange={(e) =>
                  setVehicle({
                    ...vehicle,
                    vehicle_type: e.target.value,
                  })
                }
              />
            </div>

            <div className="full">
              <label>Status</label>
              <select
                value={vehicle.status || "Available"}
                onChange={(e) =>
                  setVehicle({
                    ...vehicle,
                    status: e.target.value,
                  })
                }
              >
                <option value="Available">Available</option>
                <option value="On Trip">On Trip</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>

            <div className="full button-center">
              <button className="btn" onClick={addVehicle}>
                {editingVehicleId ? "Update Vehicle" : "Add Vehicle"}
              </button>
            </div>
          </div>

          <h3>Vehicle List</h3>

          <table>
            <thead>
              <tr>
                <th>Registration</th>
                <th>Model</th>
                <th>Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {console.log("Vehicles data:", vehicles)}
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.registration_number}</td>
                  <td>{v.model}</td>
                  <td>{v.vehicle_type}</td>
                  <td>
                    <span className={`status-badge ${v.status?.toLowerCase().replace(" ", "-") || "available"}`}>
                      {v.status || "Available"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => editVehicle(v)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={async () => {
                          await api.delete(`/vehicles/${v.id}`);
                          loadData();
                        }}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ height: "10px" }}></div>

        <div className="section">
          <h2>Trip Management</h2>

          <div className="form-grid">
            <div>
              <label>Source</label>
              <input
                placeholder="Enter Source"
                value={trip.source}
                onChange={(e) =>
                  setTrip({ ...trip, source: e.target.value })
                }
              />
            </div>

            <div>
              <label>Destination</label>
              <input
                placeholder="Enter Destination"
                value={trip.destination}
                onChange={(e) =>
                  setTrip({ ...trip, destination: e.target.value })
                }
              />
            </div>

            <div>
              <label>Driver Name</label>
              <input
                placeholder="Enter Driver Name"
                value={trip.driver_name}
                onChange={(e) =>
                  setTrip({ ...trip, driver_name: e.target.value })
                }
              />
            </div>

            <div>
              <label>Vehicle Number</label>
              <input
                placeholder="Enter Vehicle Number"
                value={trip.vehicle_number}
                onChange={(e) =>
                  setTrip({ ...trip, vehicle_number: e.target.value })
                }
              />
            </div>

            <div>
              <label>Trip Status</label>
              <select
                value={trip.status}
                onChange={(e) =>
                  setTrip({
                    ...trip,
                    status: e.target.value,
                  })
                }
              >
                <option value="Pending">Pending</option>
                <option value="Running">Running</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="full button-center">
              <button className="btn" onClick={addTrip}>
                {editingTripId ? "Update Trip" : "Create Trip"}
              </button>
            </div>
          </div>

          <h3>Trip List</h3>

          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Destination</th>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {trips.map((t) => (
                <tr key={t.id}>
                  <td>{t.source}</td>
                  <td>{t.destination}</td>
                  <td>{t.driver_name}</td>
                  <td>{t.vehicle_number}</td>
                  <td>
                    <span className={`status-badge ${t.status?.toLowerCase() || "pending"}`}>
                      {t.status || "Pending"}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => editTrip(t)}
                        title="Edit Trip"
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="delete-btn"
                        onClick={async () => {
                          await api.delete(`/trips/${t.id}`);
                          loadData();
                        }}
                        title="Delete Trip"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ height: "10px" }}></div>

        <div className="section">
          <h2>Vehicle Tracking</h2>
          <GoogleMap trips={trips} />
        </div>

        <footer className="footer">
          © 2026 Vehicle Tracking Platform | React • FastAPI • PostgreSQL
        </footer>

      </div>
    </>
  );
}

export default Dashboard;