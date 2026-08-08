import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

function GoogleMap() {
  const position = {
    lat: 10.7905,
    lng: 78.7047,
  };

  return (
    <div className="google-map-container">
      <APIProvider
        apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      >
        <Map
          defaultCenter={position}
          defaultZoom={8}
          mapId="DEMO_MAP_ID"
        >
          <AdvancedMarker position={position} />
        </Map>
      </APIProvider>
    </div>
  );
}

export default GoogleMap;