import React, { useContext } from "react";
import { createContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import {
  Box,
  Stack,
  Button,
  Fade,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { cityContext } from "./MainLayout";

export const LocationContext = createContext();

const HomeComponent = () => {
  const { city, latitude, longitude } = useContext(cityContext);
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Active link logic
  const currentPath = location.pathname;

  return (
    <div>
      {/* Animated Links Box */}
      <Fade in timeout={800}>
        <Box
          sx={{
            py: isMobile ? 1 : 2,
            backgroundColor: "background.paper",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            borderBottom: `1px solid ${theme.palette.divider}`,
            borderRadius: "16px 16px 0 0",
          }}
        >
          <Stack
            direction="row"
            spacing={isMobile ? 2 : 4}
            justifyContent="center"
            flexWrap="wrap"
          >
            {/* Restaurants Link */}
            <Button
              component={RouterLink}
              to="restaurant"
              variant={
                currentPath.includes("/restaurant") ? "contained" : "outlined"
              }
              color="primary"
              size={isMobile ? "small" : "medium"}
              sx={{
                fontWeight: 600,
                borderRadius: 3,
                textTransform: "none",
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor:
                    currentPath.includes("/restaurant")
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                },
              }}
            >
              Restaurants
            </Button>

            {/* Dishes Link */}
            <Button
              component={RouterLink}
              to="dish"
              variant={
                currentPath.includes("/dish") ? "contained" : "outlined"
              }
              color="primary"
              size={isMobile ? "small" : "medium"}
              sx={{
                fontWeight: 600,
                borderRadius: 3,
                textTransform: "none",
                px: 3,
                py: 1,
                "&:hover": {
                  backgroundColor:
                    currentPath.includes("/dish")
                      ? theme.palette.primary.dark
                      : theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                },
              }}
            >
              Dishes
            </Button>
          </Stack>
        </Box>
      </Fade>

      {/* Location Context + Outlet */}
      <LocationContext.Provider value={{ city, latitude, longitude }}>
        <Outlet />
      </LocationContext.Provider>
    </div>
  );
};

export default HomeComponent;
