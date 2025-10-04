import { useContext, useState, useEffect } from "react";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { cityContext } from "./MainLayout";
import axiosInstance from "../../utils/axios";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Fade,
  Paper,
  Typography,
} from "@mui/material";

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
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
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
      <Button
        variant="outlined"
        onClick={() => setShowMap(!showMap)}
        sx={{ mb: 2 }}
        color={showMap ? "error" : "primary"}
      >
        {showMap ? "Hide Map" : "📍 Choose Your Delivery Location"}
      </Button>

      <Collapse in={showMap} timeout={500}>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            overflow: "hidden",
            mt: 2,
          }}
        >
          <Typography
            variant="h6"
            align="center"
            sx={{ py: 1 }}
            color="primary"
          >
            Tap on the map to select your delivery point
          </Typography>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={selectedLocation || center}
            zoom={selectedLocation ? 18 : 16}
            onClick={handleMapClick}
          >
            {selectedLocation && <Marker position={selectedLocation} />}
          </GoogleMap>
        </Box>
      </Collapse>

      {selectedLocation && (
        <Fade in timeout={600}>
          <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle1" fontWeight={600}>
              Delivery Details:
            </Typography>

            {distance && (
              <Typography variant="body2">
                Distance: {distance.toFixed(2)} km
              </Typography>
            )}
            {address && (
              <Typography variant="body2">Address: {address}</Typography>
            )}
            {time && (
              <Typography variant="body2">
                Estimated Time: {time} minutes
              </Typography>
            )}
            {distanceError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {distanceError}
              </Alert>
            )}
          </Paper>
        </Fade>
      )}
    </div>
  );
};

export default MapSelector;
