import { useEffect, useState } from "react";
import api from "../services/api";
import "../App.css";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [dashboard, setDashboard] = useState({
    total_vehicles: 0,
    total_trips: 0,
  });

  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);

  const [vehicle, setVehicle] = useState({
    registration_number: "",
    model: "",
    vehicle_type: "",
  });

  const [trip, setTrip] = useState({
    source: "",
    destination: "",
    driver_name: "",
    vehicle_number: "",
  });

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
    await api.post("/vehicles/", vehicle);
    setVehicle({
      registration_number: "",
      model: "",
      vehicle_type: "",
    });
    loadData();
  };

  const addTrip = async () => {
    await api.post("/trips/", trip);
    setTrip({
      source: "",
      destination: "",
      driver_name: "",
      vehicle_number: "",
    });
    loadData();
  };

  return (
    <>
      <Navbar />

      <div className="container">
        <h1 className="title">
          Vehicle Tracking & Fleet Monitoring Platform
        </h1>

        <div className="section">
          <h2>Dashboard</h2>

          <div className="cards">
            <div className="card">
              <h3>Total Vehicles</h3>
              <h1>{dashboard.total_vehicles}</h1>
            </div>

            <div className="card">
              <h3>Total Trips</h3>
              <h1>{dashboard.total_trips}</h1>
            </div>
          </div>
        </div>

        <div style={{ height: "10px" }}></div>

        <div className="section">
          <h2>Vehicle Management</h2>

          <div className="form-grid">
            <input
              placeholder="Registration Number"
              value={vehicle.registration_number}
              onChange={(e) =>
                setVehicle({ ...vehicle, registration_number: e.target.value })
              }
            />

            <input
              placeholder="Model"
              value={vehicle.model}
              onChange={(e) =>
                setVehicle({ ...vehicle, model: e.target.value })
              }
            />

            <input
              className="full"
              placeholder="Vehicle Type"
              value={vehicle.vehicle_type}
              onChange={(e) =>
                setVehicle({ ...vehicle, vehicle_type: e.target.value })
              }
            />

            <div className="full button-center">
              <button className="btn" onClick={addVehicle}>
                Add Vehicle
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
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {vehicles.map((v) => (
                <tr key={v.id}>
                  <td>{v.registration_number}</td>
                  <td>{v.model}</td>
                  <td>{v.vehicle_type}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={async () => {
                        await api.delete(`/vehicles/${v.id}`);
                        loadData();
                      }}
                    >
                      Delete
                    </button>
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
            <input
              placeholder="Source"
              value={trip.source}
              onChange={(e) =>
                setTrip({ ...trip, source: e.target.value })
              }
            />

            <input
              placeholder="Destination"
              value={trip.destination}
              onChange={(e) =>
                setTrip({ ...trip, destination: e.target.value })
              }
            />

            <input
              placeholder="Driver Name"
              value={trip.driver_name}
              onChange={(e) =>
                setTrip({ ...trip, driver_name: e.target.value })
              }
            />

            <input
              placeholder="Vehicle Number"
              value={trip.vehicle_number}
              onChange={(e) =>
                setTrip({ ...trip, vehicle_number: e.target.value })
              }
            />

            <div className="full button-center">
              <button className="btn" onClick={addTrip}>
                Create Trip
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
                    <button
                      className="delete-btn"
                      onClick={async () => {
                        await api.delete(`/trips/${t.id}`);
                        loadData();
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Dashboard;