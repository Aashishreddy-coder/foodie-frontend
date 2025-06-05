import React from "react";
import { useState, useContext } from "react";
import { createContext } from "react";
import { Outlet, Link } from "react-router-dom";
import { useEffect } from "react";
import { Box, Stack, Link as MuiLink } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { cityContext } from "./MainLayout";

export const LocationContext = createContext();

const HomeComponent = () => {
  const { city, latitude, longitude } = useContext(cityContext);

  return (
    <div>
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
    </div>
  );
};

export default HomeComponent;
