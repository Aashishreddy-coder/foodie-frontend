import React from "react";
import { useState } from "react";
import { createContext } from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect } from "react";
import { Box, Stack, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export const LocationContext = createContext();

const HomeComponent = () => {
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState(19.076);
  const [longitude, setLongitude] = useState(72.8777);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div>
      <Header city={city} setCity={setCity} />
      <Box sx={{ py: 2, backgroundColor: "#f5f5f5" }}>
        <Stack
          direction="row"
          spacing={4}
          justifyContent="center"
          flexWrap="wrap"
        >
          <MuiLink
            component={RouterLink}
            to="restaurant"
            underline="hover"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              fontSize: "1.1rem",
            }}
          >
            Restaurants
          </MuiLink>
          <MuiLink
            component={RouterLink}
            to="dish"
            underline="hover"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              fontSize: "1.1rem",
            }}
          >
            Dishes
          </MuiLink>
        </Stack>
      </Box>
      <LocationContext.Provider value={{ city, latitude, longitude }}>
        <Outlet />
      </LocationContext.Provider>
      <Footer />
    </div>
  );
};

export default HomeComponent;
