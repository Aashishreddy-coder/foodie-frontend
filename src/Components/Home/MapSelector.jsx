import { useContext, useState, useEffect } from "react";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { cityContext } from "./MainLayout";
import axiosInstance from "../../utils/axios";
import { Alert, Box } from "@mui/material";

const mapContainerStyle = {
  width: "100%",
  height: "500px", // Not 100%
};

const MapSelector = ({
  restaurantId,
  onLocationValid,
  setDistance,
  setAddress,
  distance,
  address,
  setTime,
  time,
}) => {
  const { latitude, longitude } = useContext(cityContext);
  const center = { lat: latitude, lng: longitude };
  const [showMap, setShowMap] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [distanceError, setDistanceError] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCzviV_eTddv220qNG0wrl_kVLzpCAgLPQ",
  });

  useEffect(() => {
    const checkDeliveryDistance = async () => {
      if (selectedLocation && restaurantId) {
        try {
          const response = await axiosInstance.get(
            `/restaurants/${restaurantId}/distance`,
            {
              params: {
                latitude: selectedLocation.lat,
                longitude: selectedLocation.lng,
              },
            }
          );

          const calculatedDistance = response.data.distanceInMeters / 1000;
          setAddress(response.data.address);
          setDistance(calculatedDistance);
          setTime(response.data.timeInMinutes);

          if (calculatedDistance > 30) {
            setDistanceError(
              `Delivery distance (${calculatedDistance.toFixed(
                2
              )} km) is too far. Maximum delivery distance is 30 km.`
            );
            onLocationValid(false);
          } else {
            setDistanceError(null);
            onLocationValid(true);
          }
        } catch (error) {
          console.error("Error checking delivery distance:", error);
          setDistanceError(
            "Error checking delivery distance. Please select proper location."
          );
          onLocationValid(false);
        }
      } else {
        onLocationValid(false);
      }
    };

    checkDeliveryDistance();
  }, [selectedLocation, restaurantId, onLocationValid]);

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelectedLocation({ lat, lng });
  };

  if (loadError) return <div>Error loading map</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <button onClick={() => setShowMap(!showMap)}>
        {showMap ? "Hide Map" : "Show Map"}
      </button>

      {showMap && (
        <div>
          <h1>Map</h1>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={selectedLocation || center}
            zoom={selectedLocation ? 20 : 20}
            onClick={handleMapClick}
          >
            {selectedLocation && <Marker position={selectedLocation} />}
          </GoogleMap>
        </div>
      )}
      {selectedLocation && (
        <Box sx={{ mt: 2 }}>
          <h4>Selected Coordinates:</h4>
          <p>Latitude: {selectedLocation.lat}</p>
          <p>Longitude: {selectedLocation.lng}</p>
          {distance && <p>Distance: {distance.toFixed(2)} km</p>}
          {address && <p>Address: {address}</p>}
          {time && <p>Time: {time}</p>}
          {distanceError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {distanceError}
            </Alert>
          )}
        </Box>
      )}
    </div>
  );
};

export default MapSelector;
