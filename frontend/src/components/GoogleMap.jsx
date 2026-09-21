import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";

import { FaTruck } from "react-icons/fa";

import { useEffect, useMemo, useRef, useState } from "react";
import api from "../services/api";


// =====================================================
// FIXED DEMO ROUTE
// TRICHY → CHENNAI
// =====================================================

const TRICHY_TO_CHENNAI = [
  { lat: 10.7905, lng: 78.7047 }, // Trichy
  { lat: 10.9500, lng: 78.7600 },
  { lat: 11.2342, lng: 78.8803 }, // Perambalur
  { lat: 11.4500, lng: 78.7500 },
  { lat: 11.6643, lng: 78.1460 }, // Salem
  { lat: 11.9500, lng: 78.5500 },
  { lat: 12.2500, lng: 78.8000 },
  { lat: 12.5500, lng: 79.0500 },
  { lat: 12.9165, lng: 79.1325 }, // Vellore
  { lat: 12.8342, lng: 79.7036 }, // Kanchipuram
  { lat: 12.6819, lng: 79.8711 }, // Chengalpattu
  { lat: 12.8500, lng: 80.0500 },
  { lat: 13.0827, lng: 80.2707 }, // Chennai
];


// =====================================================
// CREATE A SMOOTH PATH BETWEEN THE ROUTE POINTS
// =====================================================

function createSmoothPath(points, pointsPerSegment = 8) {
  const result = [];

  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];

    for (let j = 0; j < pointsPerSegment; j++) {
      const t = j / pointsPerSegment;

      result.push({
        lat:
          start.lat +
          (end.lat - start.lat) * t,

        lng:
          start.lng +
          (end.lng - start.lng) * t,
      });
    }
  }

  result.push(points[points.length - 1]);

  return result;
}


// =====================================================
// BLUE ROUTE LINE
// =====================================================

function RouteLine() {
  const map = useMap();

  const smoothPath = useMemo(
    () => createSmoothPath(TRICHY_TO_CHENNAI),
    []
  );

  useEffect(() => {
    if (!map || !window.google) {
      return;
    }

    const polyline =
      new window.google.maps.Polyline({
        path: smoothPath,
        geodesic: true,
        strokeColor: "#2563eb",
        strokeOpacity: 0.95,
        strokeWeight: 5,
      });

    polyline.setMap(map);

    // Fit the entire Trichy → Chennai route
    const bounds =
      new window.google.maps.LatLngBounds();

    smoothPath.forEach((point) => {
      bounds.extend(point);
    });

    map.fitBounds(bounds, 50);

    return () => {
      polyline.setMap(null);
    };
  }, [map, smoothPath]);

  return null;
}


// =====================================================
// VEHICLE MARKER
// =====================================================

function VehicleMarker({
  location,
  vehicleNumber,
}) {
  const [showNumber, setShowNumber] =
    useState(false);

  if (!location) {
    return null;
  }

  return (
    <AdvancedMarker
      position={{
        lat: Number(location.latitude),
        lng: Number(location.longitude),
      }}
    >
      <div
        onClick={() =>
          setShowNumber((value) => !value)
        }
        style={{
          position: "relative",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {showNumber && (
          <div
            style={{
              position: "absolute",
              bottom: "45px",
              background: "#111827",
              color: "#ffffff",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              whiteSpace: "nowrap",
              boxShadow:
                "0 2px 8px rgba(0,0,0,.25)",
              zIndex: 20,
            }}
          >
            {vehicleNumber}
          </div>
        )}

        <div
          style={{
            fontSize: "34px",
            lineHeight: 1,
          }}
        >
          🚛
        </div>
      </div>
    </AdvancedMarker>
  );
}


// =====================================================
// GOOGLE MAP
// =====================================================

function GoogleMap({
  trips = [],
  vehicles = [],
}) {
  const [progress, setProgress] =
    useState(0);

  const [vehicleLocation, setVehicleLocation] =
    useState(null);

  const [simulationRunning, setSimulationRunning] =
    useState(false);

  const simulationTimerRef =
    useRef(null);

  const simulationIndexRef =
    useRef(0);

  // ===================================================
  // ACTIVE TRIP
  // ===================================================

  const runningTrip = trips.find(
    (trip) => trip.status === "Active"
  );

  // ===================================================
  // ACTIVE VEHICLE
  // ===================================================

  const runningVehicle = vehicles.find(
    (vehicle) =>
      vehicle.id === runningTrip?.vehicle_id
  );

  // ===================================================
  // RESET WHEN TRIP CHANGES
  // ===================================================

  useEffect(() => {
    setProgress(0);
    setVehicleLocation(null);
    setSimulationRunning(false);

    simulationIndexRef.current = 0;

    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);

      simulationTimerRef.current = null;
    }
  }, [runningTrip?.id]);

  // ===================================================
  // CLEANUP
  // ===================================================

  useEffect(() => {
    return () => {
      if (simulationTimerRef.current) {
        clearInterval(
          simulationTimerRef.current
        );
      }
    };
  }, []);

  // ===================================================
  // START SIMULATION
  // ===================================================

  const startSimulation = () => {
    if (!runningTrip || !runningVehicle) {
      return;
    }

    if (simulationTimerRef.current) {
      return;
    }

    const path =
      createSmoothPath(
        TRICHY_TO_CHENNAI,
        8
      );

    let index =
      simulationIndexRef.current;

    setSimulationRunning(true);

    // -----------------------------------------------
    // Immediately place truck at TRICHY
    // -----------------------------------------------

    const startPoint = path[index];

    setVehicleLocation({
      latitude: startPoint.lat,
      longitude: startPoint.lng,
    });

    setProgress(0);

    // -----------------------------------------------
    // MOVE EVERY 2 SECONDS
    // -----------------------------------------------

    simulationTimerRef.current =
      setInterval(async () => {

        index += 1;

        // ---------------------------------------------
        // DESTINATION REACHED
        // ---------------------------------------------

        if (index >= path.length) {
          index = path.length - 1;

          const destination =
            path[index];

          setVehicleLocation({
            latitude: destination.lat,
            longitude: destination.lng,
          });

          setProgress(100);

          simulationIndexRef.current =
            index;

          clearInterval(
            simulationTimerRef.current
          );

          simulationTimerRef.current =
            null;

          setSimulationRunning(false);

          // -------------------------------------------
          // SAVE FINAL GPS LOCATION
          // -------------------------------------------

          try {
            await api.post(
              "/vehicle-locations/",
              {
                vehicle_id:
                  runningVehicle.id,

                trip_id:
                  runningTrip.id,

                latitude:
                  destination.lat,

                longitude:
                  destination.lng,
              }
            );
          } catch (error) {
            console.error(
              "Final GPS update failed:",
              error
            );
          }

          // -------------------------------------------
          // COMPLETE TRIP IN BACKEND
          // -------------------------------------------

          try {
            await api.put(
              `/trips/${runningTrip.id}`,
              {
                status: "Completed",
              }
            );

            console.log(
              "Trip completed successfully"
            );
          } catch (error) {
            console.error(
              "Failed to complete trip:",
              error
            );
          }

          return;
        }

        // ---------------------------------------------
        // CURRENT POSITION
        // ---------------------------------------------

        const point = path[index];

        const location = {
          latitude: point.lat,
          longitude: point.lng,
        };

        // ---------------------------------------------
        // UPDATE UI POSITION
        // ---------------------------------------------

        setVehicleLocation(location);

        // ---------------------------------------------
        // UPDATE PROGRESS
        // ---------------------------------------------

        const newProgress =
          Math.round(
            (index /
              (path.length - 1)) *
              100
          );

        setProgress(newProgress);

        simulationIndexRef.current =
          index;

        // ---------------------------------------------
        // SAVE GPS TO BACKEND
        // ---------------------------------------------

        try {
          await api.post(
            "/vehicle-locations/",
            {
              vehicle_id:
                runningVehicle.id,

              trip_id:
                runningTrip.id,

              latitude:
                point.lat,

              longitude:
                point.lng,
            }
          );

          console.log(
            "GPS:",
            point.lat,
            point.lng,
            `${newProgress}%`
          );
        } catch (error) {
          console.error(
            "GPS update failed:",
            error
          );
        }

      }, 2000);
  };

  // ===================================================
  // STOP SIMULATION
  // ===================================================

  const stopSimulation = () => {
    if (simulationTimerRef.current) {
      clearInterval(
        simulationTimerRef.current
      );

      simulationTimerRef.current =
        null;
    }

    setSimulationRunning(false);
  };

  // ===================================================
  // MAP CENTER
  // ===================================================

  const mapCenter = vehicleLocation
    ? {
        lat:
          Number(
            vehicleLocation.latitude
          ),

        lng:
          Number(
            vehicleLocation.longitude
          ),
      }
    : {
        lat: 10.7905,
        lng: 78.7047,
      };

  // ===================================================
  // NO ACTIVE TRIP
  // ===================================================

  if (!runningTrip) {
    return (
      <div
        style={{
          width: "100%",
          height: "420px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8fafc",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#64748b",
          }}
        >
          <FaTruck
            style={{
              fontSize: "36px",
              marginBottom: "10px",
            }}
          />

          <div
            style={{
              fontWeight: "600",
              color: "#334155",
            }}
          >
            No active trip
          </div>

          <div
            style={{
              fontSize: "13px",
              marginTop: "4px",
            }}
          >
            Start a trip from Fleet Manager
            to begin tracking.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* =================================================
          MAP
          ================================================= */}

      <div
        className="google-map-container"
        style={{
          width: "100%",
          height: "420px",
          minHeight: "420px",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <APIProvider
          apiKey={
            import.meta.env
              .VITE_GOOGLE_MAPS_API_KEY
          }
        >
          <Map
            center={mapCenter}
            zoom={7}
            mapId="DEMO_MAP_ID"
            gestureHandling="greedy"
          >
            <RouteLine />

            {vehicleLocation && (
              <VehicleMarker
                location={vehicleLocation}
                vehicleNumber={
                  runningVehicle?.registration_number ||
                  `Vehicle #${runningTrip.vehicle_id}`
                }
              />
            )}
          </Map>
        </APIProvider>
      </div>

      {/* =================================================
          TRACKING PANEL
          ================================================= */}

      <div className="tracking-panel">

        <h3>
          Vehicle Tracking
        </h3>

        <div className="tracking-row">
          <span>Vehicle</span>

          <strong>
            {runningVehicle?.registration_number ||
              `Vehicle #${runningTrip.vehicle_id}`}
          </strong>
        </div>

        <div className="tracking-row">
          <span>Driver</span>

          <strong>
            {runningTrip.driver_name ||
              `Driver #${runningTrip.driver_id}`}
          </strong>
        </div>

        <div className="tracking-row">
          <span>Status</span>

          <strong
            className="tracking-status"
          >
            🟢 {runningTrip.status}
          </strong>
        </div>

        <div className="tracking-row">
          <span>Route</span>

          <strong>
            Trichy → Chennai
          </strong>
        </div>

        <div className="tracking-row">
          <span>Location</span>

          <strong>
            {vehicleLocation ? (
              <span
                style={{
                  color: "#22c55e",
                }}
              >
                ● Live GPS
              </span>
            ) : (
              <span
                style={{
                  color: "#f97316",
                }}
              >
                ⚠ Waiting for GPS
              </span>
            )}
          </strong>
        </div>

        {vehicleLocation && (
          <div className="tracking-row">
            <span>Coordinates</span>

            <strong
              style={{
                fontSize: "13px",
              }}
            >
              {Number(
                vehicleLocation.latitude
              ).toFixed(6)}
              °,{" "}
              {Number(
                vehicleLocation.longitude
              ).toFixed(6)}
              °
            </strong>
          </div>
        )}

        {/* =================================================
            CONTROLS
            ================================================= */}

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
            marginBottom: "15px",
          }}
        >
          <button
            className="btn"
            onClick={startSimulation}
            disabled={simulationRunning}
          >
            🚛 Start Simulation
          </button>

          <button
            className="btn"
            onClick={stopSimulation}
            disabled={!simulationRunning}
          >
            ⏹ Stop Simulation
          </button>
        </div>

        {/* =================================================
            SIMULATION STATUS
            ================================================= */}

        <div className="tracking-row">
          <span>Simulation</span>

          <strong>
            {simulationRunning ? (
              <span
                style={{
                  color: "#22c55e",
                }}
              >
                🟢 Running
              </span>
            ) : (
              <span
                style={{
                  color: "#6b7280",
                }}
              >
                ⚪ Stopped
              </span>
            )}
          </strong>
        </div>

        {/* =================================================
            PROGRESS
            ================================================= */}

        <div className="tracking-progress">

          <div className="tracking-progress-header">

            <span>
              Trip Progress
            </span>

            <strong>
              {progress}%
            </strong>

          </div>

          <div className="progress-bar">

            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

      </div>
    </>
  );
}

export default GoogleMap;