import {
  APIProvider,
  Map,
  AdvancedMarker,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import { useEffect, useState } from "react";


function RouteDisplay({ trip, onTrackingUpdate }) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");

  const [route, setRoute] = useState(null);
  const [showVehicleNumber, setShowVehicleNumber] = useState(false);
  const [vehicleIndex, setVehicleIndex] = useState(0);


  // ==========================
  // Calculate Route
  // ==========================

  useEffect(() => {
    if (!map || !routesLibrary || !trip) return;

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

        if (!result.routes || result.routes.length === 0) {
          console.error("No route found");
          return;
        }

        setRoute(result.routes[0]);
      } catch (error) {
        console.error("Route calculation failed:", error);
      }
    };

    calculateRoute();
  }, [map, routesLibrary, trip]);


  // ==========================
  // Reset Vehicle
  // ==========================

  useEffect(() => {
    setVehicleIndex(0);
  }, [route]);


  // ==========================
  // Move Vehicle
  // ==========================

  useEffect(() => {
    if (!route || !route.path || route.path.length === 0) {
      return;
    }

    const movementInterval = setInterval(() => {
      setVehicleIndex((currentIndex) => {
        if (currentIndex >= route.path.length - 1) {
          return 0;
        }

        return currentIndex + 1;
      });
    }, 500);

    return () => {
      clearInterval(movementInterval);
    };
  }, [route]);


  // ==========================
  // Draw Route
  // ==========================

  useEffect(() => {
    if (!route || !map) return;

    const polylines = route.createPolylines();

    polylines.forEach((polyline) => {
      polyline.setMap(map);
    });

    if (route.path) {
      const bounds = new google.maps.LatLngBounds();

      route.path.forEach((point) => {
        bounds.extend(point);
      });

      map.fitBounds(bounds);
    }

    return () => {
      polylines.forEach((polyline) => {
        polyline.setMap(null);
      });
    };
  }, [route, map]);


  // ==========================
  // Calculate Progress
  // ==========================

  useEffect(() => {
    if (!route || !route.path || route.path.length === 0) {
      return;
    }

    const progress = Math.round(
      (vehicleIndex / (route.path.length - 1)) * 100
    );

    onTrackingUpdate({
      vehicle: trip.vehicle_number,
      driver: trip.driver_name,
      status: trip.status,
      source: trip.source,
      destination: trip.destination,
      progress: progress,
    });

  }, [vehicleIndex, route, trip, onTrackingUpdate]);


  // ==========================
  // Vehicle Marker
  // ==========================

  if (!route || !route.path || route.path.length === 0) {
    return null;
  }

  const vehiclePosition = route.path[vehicleIndex];


  return (
    <AdvancedMarker position={vehiclePosition}>

      <div
        onClick={() =>
          setShowVehicleNumber(!showVehicleNumber)
        }
        style={{
          position: "relative",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "auto",
        }}
      >

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
            {trip.vehicle_number}
          </div>
        )}

        <div
          style={{
            fontSize: "30px",
            lineHeight: "1",
            userSelect: "none",
          }}
        >
          🚚
        </div>

      </div>

    </AdvancedMarker>
  );
}


// ==========================
// Google Map
// ==========================

function GoogleMap({ trips }) {

  const [trackingData, setTrackingData] = useState({
    vehicle: "",
    driver: "",
    status: "",
    source: "",
    destination: "",
    progress: 0,
  });


  const runningTrip = trips.find(
    (trip) =>
      trip.status === "Running" ||
      trip.status === "On Trip"
  );


  const handleTrackingUpdate = (data) => {
    setTrackingData(data);
  };


  return (
    <div>

      {/* ==========================
          MAP
      ========================== */}

      <div className="google-map-container">

        <APIProvider
          apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        >

          <Map
            defaultCenter={{
              lat: 20.5937,
              lng: 78.9629,
            }}
            defaultZoom={5}
            mapId="DEMO_MAP_ID"
          >

            {runningTrip && (
              <RouteDisplay
                trip={runningTrip}
                onTrackingUpdate={handleTrackingUpdate}
              />
            )}

          </Map>

        </APIProvider>

      </div>


      {/* ==========================
          TRACKING PANEL
      ========================== */}

      {runningTrip && (
        <div className="tracking-panel">

          <h3>Vehicle Tracking</h3>

          <div className="tracking-row">
            <span>Vehicle</span>
            <strong>
              {trackingData.vehicle}
            </strong>
          </div>

          <div className="tracking-row">
            <span>Driver</span>
            <strong>
              {trackingData.driver}
            </strong>
          </div>

          <div className="tracking-row">
            <span>Status</span>
            <strong className="tracking-status">
              🟢 {trackingData.status}
            </strong>
          </div>

          <div className="tracking-row">
            <span>Route</span>
            <strong>
              {trackingData.source} →{" "}
              {trackingData.destination}
            </strong>
          </div>


          <div className="tracking-progress">

            <div className="tracking-progress-header">

              <span>
                Trip Progress
              </span>

              <strong>
                {trackingData.progress}%
              </strong>

            </div>


            <div className="progress-bar">

              <div
                className="progress-fill"
                style={{
                  width: `${trackingData.progress}%`,
                }}
              />

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default GoogleMap;