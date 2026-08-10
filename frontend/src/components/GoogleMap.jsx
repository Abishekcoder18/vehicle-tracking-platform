import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import { useEffect, useRef, useState, useCallback } from "react";
import api from "../services/api";


// =====================================================
// ROUTE DISPLAY (Only draws the route line and calculates progress)
// =====================================================

function RouteDisplay({
  trip,
  vehicleId,
  vehicleLocation,
  onProgressChange,
  simulationRunning,
  onSimulationComplete,
}) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");

  const [route, setRoute] = useState(null);

  // Prevent the same route from being calculated repeatedly
  const calculatedRouteRef = useRef("");

  // Prevent duplicate progress updates
  const lastProgressRef = useRef(-1);


  // ===================================================
  // ROUTE CALCULATION
  // ===================================================

  useEffect(() => {
    if (!map || !routesLibrary) {
      return;
    }

    if (!trip?.source || !trip?.destination) {
      return;
    }

    const routeKey = `${trip.source}|${trip.destination}`;

    // IMPORTANT:
    // Do not calculate the same route repeatedly
    if (calculatedRouteRef.current === routeKey) {
      return;
    }

    calculatedRouteRef.current = routeKey;

    let cancelled = false;

    const calculateRoute = async () => {
      try {
        const { Route } = routesLibrary;

        const request = {
          origin: trip.source,
          destination: trip.destination,
          travelMode: "DRIVING",
          fields: ["path"],
        };

        const result = await Route.computeRoutes(request);

        if (cancelled) {
          return;
        }

        if (!result.routes || result.routes.length === 0) {
          console.error("No route found");
          calculatedRouteRef.current = "";
          return;
        }

        setRoute(result.routes[0]);

      } catch (error) {
        if (!cancelled) {
          console.error("Route calculation failed:", error);
          calculatedRouteRef.current = "";
        }
      }
    };

    calculateRoute();

    return () => {
      cancelled = true;
    };

  }, [
    map,
    routesLibrary,
    trip?.source,
    trip?.destination,
  ]);

  // ===================================================
  // DRAW ROUTE (Only the polyline, no vehicle marker)
  // ===================================================

  useEffect(() => {
    if (!route || !map) {
      return;
    }

    const polylines = route.createPolylines();

    polylines.forEach((polyline) => {
      polyline.setMap(map);
    });

    // Fit map to route
    if (route.path?.length) {

      const bounds = new google.maps.LatLngBounds();

      route.path.forEach((point) => {
        bounds.extend(point);
      });

      map.fitBounds(bounds);
    }

    // Cleanup
    return () => {

      polylines.forEach((polyline) => {
        polyline.setMap(null);
      });

    };

  }, [route, map]);


  // ===================================================
  // GPS SIMULATOR
  // Sends the vehicle along the actual Google route
  // ===================================================

  const simulatorRunningRef = useRef(false);

  useEffect(() => {
    if (
      !route?.path?.length ||
      !vehicleId ||
      !trip?.id ||
      !simulationRunning
    ) {
      return;
    }

    // Prevent duplicate simulator instances
    if (simulatorRunningRef.current) {
      console.log("GPS Simulator already running");
      return;
    }

    simulatorRunningRef.current = true;

    let currentIndex = 0;

    // Start from the current GPS position if available
    if (vehicleLocation && route.path?.length) {
      let closestIndex = 0;
      let closestDistance = Infinity;

      route.path.forEach((point, index) => {
        const lat =
          typeof point.lat === "function"
            ? point.lat()
            : point.lat;

        const lng =
          typeof point.lng === "function"
            ? point.lng()
            : point.lng;

        const distance =
          Math.pow(lat - vehicleLocation.latitude, 2) +
          Math.pow(lng - vehicleLocation.longitude, 2);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      currentIndex = closestIndex;

      console.log(
        "GPS Simulator starting from route index:",
        currentIndex
      );
    }

    let stopped = false;

    const lastIndex = route.path.length - 1;

    // Around 40 GPS points for the complete trip
    const step = Math.max(
      1,
      Math.floor(route.path.length / 40)
    );

    const sendGpsLocation = async () => {
      if (stopped) {
        return;
      }

      const point = route.path[currentIndex];

      if (!point) {
        return;
      }

      const latitude =
        typeof point.lat === "function"
          ? point.lat()
          : point.lat;

      const longitude =
        typeof point.lng === "function"
          ? point.lng()
          : point.lng;

      try {
        await api.post("/vehicle-locations/", {
          vehicle_id: vehicleId,
          trip_id: trip.id,
          latitude,
          longitude,
        });

        console.log(
          "GPS Simulator:",
          latitude,
          longitude
        );

      } catch (error) {

        if (!stopped) {
          console.error(
            "GPS Simulator failed:",
            error
          );
        }

        return;
      }

      // Check if destination reached
      if (currentIndex >= lastIndex) {

        console.log(
          "GPS Simulator reached destination"
        );

        stopped = true;
        simulatorRunningRef.current = false;

        if (simulatorInterval) {
          clearInterval(simulatorInterval);
        }

        // Set progress to 100% and notify completion
        onProgressChange(100);
        onSimulationComplete();

        return;
      }

      currentIndex = Math.min(
        currentIndex + step,
        lastIndex
      );
    };

    let simulatorInterval = null;

    // Send starting location immediately
    sendGpsLocation();

    // Continue every 5 seconds (slower for better demonstration)
    simulatorInterval = setInterval(() => {

      if (stopped) {
        clearInterval(simulatorInterval);
        return;
      }

      sendGpsLocation();

    }, 5000);

    return () => {

      stopped = true;

      if (simulatorInterval) {
        clearInterval(simulatorInterval);
      }

      simulatorRunningRef.current = false;

      console.log(
        "GPS Simulator stopped"
      );
    };

  }, [
    route,
    vehicleId,
    trip?.id,
    simulationRunning,
  ]);


  // ===================================================
  // UPDATE PROGRESS BASED ON GPS COORDINATE
  // ===================================================

  useEffect(() => {
    if (!route?.path?.length || !vehicleLocation) {
      return;
    }

    const totalPoints = route.path.length - 1;

    if (totalPoints <= 0) {
      return;
    }

    const vehicleLat = vehicleLocation.latitude;
    const vehicleLng = vehicleLocation.longitude;

    let closestIndex = 0;
    let closestDistance = Infinity;

    route.path.forEach((point, index) => {
      const lat = typeof point.lat === "function"
        ? point.lat()
        : point.lat;

      const lng = typeof point.lng === "function"
        ? point.lng()
        : point.lng;

      const distance =
        Math.pow(lat - vehicleLat, 2) +
        Math.pow(lng - vehicleLng, 2);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    const calculatedProgress = Math.round(
      (closestIndex / totalPoints) * 100
    );

    if (lastProgressRef.current === calculatedProgress) {
      return;
    }

    lastProgressRef.current = calculatedProgress;

    onProgressChange(calculatedProgress);

  }, [
    route,
    vehicleLocation,
    onProgressChange,
  ]);


  // ===================================================
  // WAIT FOR ROUTE
  // ===================================================

  if (!route?.path?.length) {
    return null;
  }

  // This component now only draws the route line and calculates progress
  return null;
}


// =====================================================
// VEHICLE LOCATION MARKER
// =====================================================

function VehicleLocationMarker({ location, vehicleNumber }) {
  const [showVehicleNumber, setShowVehicleNumber] = useState(false);

  if (!location) return null;

  return (
    <AdvancedMarker
      key={`${location.latitude}-${location.longitude}`}
      position={{
        lat: Number(location.latitude),
        lng: Number(location.longitude),
      }}
    >
      <div
        onClick={() => setShowVehicleNumber(!showVehicleNumber)}
        style={{
          position: "relative",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >
        {/* Vehicle Number Tooltip */}
        {showVehicleNumber && (
          <div
            style={{
              position: "absolute",
              bottom: "42px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#111827",
              color: "white",
              padding: "6px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: "600",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
              zIndex: 10,
            }}
          >
            {vehicleNumber}
          </div>
        )}

        {/* Truck Icon with pulse effect */}
        <div
          style={{
            fontSize: "36px",
            lineHeight: "1",
            userSelect: "none",
            animation: "pulse 2s infinite",
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

  const [progress, setProgress] = useState(0);
  const [vehicleLocation, setVehicleLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);


  // ===================================================
  // FIND RUNNING TRIP
  // ===================================================

  const runningTrip = trips.find(
    (trip) =>
      trip.status === "Running" ||
      trip.status === "On Trip"
  );


  // ===================================================
  // FIND RUNNING VEHICLE
  // ===================================================

  const runningVehicle = vehicles.find(
    (vehicle) =>
      vehicle.registration_number ===
      runningTrip?.vehicle_number
  );


  // ===================================================
  // FETCH VEHICLE LOCATION
  // ===================================================

  useEffect(() => {
    // Reset location when trip changes
    setVehicleLocation(null);
    setLocationError(null);

    if (!runningVehicle?.id) {
      return;
    }

    const fetchVehicleLocation = async () => {
      setLoadingLocation(true);
      setLocationError(null);

      try {
        const response = await api.get(
          `/vehicle-locations/vehicle/${runningVehicle.id}/latest`
        );

        console.log("Latest vehicle location:", response.data);

        if (response.data) {
          setVehicleLocation(response.data);
        } else {
          setLocationError("No location data available");
        }
      } catch (error) {
        console.error("Failed to fetch vehicle location:", error);
        setLocationError("Failed to load vehicle location");
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchVehicleLocation();

    // Poll for updates every 3 seconds (faster for smoother movement)
    const intervalId = setInterval(fetchVehicleLocation, 3000);

    return () => {
      clearInterval(intervalId);
    };

  }, [runningVehicle?.id]);


  // ===================================================
  // PROGRESS CALLBACK
  // ===================================================

  const handleProgressChange = useCallback(
    (newProgress) => {

      setProgress((currentProgress) => {

        // Don't update state if value hasn't changed

        if (currentProgress === newProgress) {
          return currentProgress;
        }

        return newProgress;
      });

    },
    []
  );


  // ===================================================
  // RESET PROGRESS WHEN TRIP CHANGES
  // ===================================================

  useEffect(() => {

    setProgress(0);

  }, [
    runningTrip?.id,
  ]);


  // ===================================================
  // MAP + TRACKING PANEL
  // ===================================================

  return (
    <>

      {/* ==============================================
          GOOGLE MAP
          ============================================== */}

      <div className="google-map-container">

        <APIProvider
          apiKey={
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
          }
        >

          <Map
            defaultCenter={{
              lat: 20.5937,
              lng: 78.9629,
            }}
            defaultZoom={5}
            mapId="DEMO_MAP_ID"
          >

            {/* Always show the route if there's a running trip */}
            {runningTrip && (
              <RouteDisplay
                trip={runningTrip}
                vehicleId={runningVehicle?.id}
                vehicleLocation={vehicleLocation}
                onProgressChange={handleProgressChange}
                simulationRunning={simulationRunning}
                onSimulationComplete={() => setSimulationRunning(false)}
              />
            )}

            {/* Show actual vehicle location if available */}
            {runningTrip && vehicleLocation && (
              <VehicleLocationMarker
                location={vehicleLocation}
                vehicleNumber={runningTrip.vehicle_number}
              />
            )}

          </Map>

        </APIProvider>

      </div>


      {/* ==============================================
          TRACKING PANEL
          ============================================== */}

      {runningTrip && (

        <div className="tracking-panel">

          <h3>
            Vehicle Tracking
          </h3>


          {/* Vehicle */}

          <div className="tracking-row">

            <span>
              Vehicle
            </span>

            <strong>
              {runningTrip.vehicle_number}
            </strong>

          </div>


          {/* Driver */}

          <div className="tracking-row">

            <span>
              Driver
            </span>

            <strong>
              {runningTrip.driver_name}
            </strong>

          </div>


          {/* Status */}

          <div className="tracking-row">

            <span>
              Status
            </span>

            <strong className="tracking-status">

              🟢 {runningTrip.status}

            </strong>

          </div>


          {/* Route */}

          <div className="tracking-row">

            <span>
              Route
            </span>

            <strong>

              {runningTrip.source}

              {" → "}

              {runningTrip.destination}

            </strong>

          </div>


          {/* Location Status */}

          <div className="tracking-row">

            <span>
              Location
            </span>

            <strong>
              {loadingLocation ? (
                "Loading..."
              ) : locationError ? (
                <span style={{ color: "#f97316" }}>
                  ⚠️ {locationError}
                </span>
              ) : vehicleLocation ? (
                <span style={{ color: "#22c55e" }}>
                  ✅ Live GPS
                </span>
              ) : (
                "No location data"
              )}
            </strong>

          </div>


          {/* Coordinates */}

          {vehicleLocation && (
            <div className="tracking-row">

              <span>
                Coordinates
              </span>

              <strong style={{ fontSize: "13px" }}>
                {vehicleLocation.latitude.toFixed(6)}°,{" "}
                {vehicleLocation.longitude.toFixed(6)}°
              </strong>

            </div>
          )}


          {/* ==========================================
              GPS SIMULATION CONTROLS
              ========================================== */}

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
              onClick={() => setSimulationRunning(true)}
              disabled={simulationRunning}
            >
              🚛 Start Simulation
            </button>

            <button
              className="btn"
              onClick={() => setSimulationRunning(false)}
              disabled={!simulationRunning}
            >
              ⏹ Stop Simulation
            </button>

          </div>


          {/* Simulation Status */}

          <div className="tracking-row">

            <span>
              Simulation
            </span>

            <strong>
              {simulationRunning ? (
                <span style={{ color: "#22c55e" }}>
                  🟢 Running
                </span>
              ) : (
                <span style={{ color: "#6b7280" }}>
                  ⚪ Stopped
                </span>
              )}
            </strong>

          </div>


          {/* ==========================================
              PROGRESS
              ========================================== */}

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

      )}

    </>
  );
}


export default GoogleMap;