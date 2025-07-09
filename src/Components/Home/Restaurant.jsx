import React, { useState, useEffect, useContext } from "react";
import { LocationContext } from "./HomeComponent";
import axiosInstance from "../../utils/axios";
import RestaurantCard from "./RestaurantCard";
import {
  TextField, Box, Grid, Fade, Typography, useMediaQuery, useTheme
} from "@mui/material";

const Restaurant = () => {
  const { city, latitude, longitude } = useContext(LocationContext);
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const searchRestaurants = async () => {
    try {
      const response = await axiosInstance.get("/restaurants/nearby", {
        params: {
          name: search,
          latitude,
          longitude,
          city,
        },
      });
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    searchRestaurants();
  }, [search, city, latitude, longitude]);

  return (
    <Box
      sx={{
        backgroundColor: "background.container",
        p: { xs: 2, md: 3 },
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        mt: 2,
        mx: { xs: 1, md: "auto" },
        maxWidth: "1200px",
      }}
    >
      <Fade in timeout={800}>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          color="primary"
          fontWeight="bold"
          gutterBottom
          sx={{ textAlign: "center", mb: 3 }}
        >
          Nearby Restaurants 🍽️
        </Typography>
      </Fade>

      {/* Search Bar */}
      <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Restaurants..."
          variant="outlined"
          size="small"
          sx={{
            width: "100%",
            maxWidth: 400,
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        />
      </Box>

      {/* Restaurant Cards */}
      {restaurants.length === 0 ? (
        <Fade in timeout={800}>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            No restaurants found.
          </Typography>
        </Fade>
      ) : (
        <Fade in timeout={800}>
          <Grid container spacing={3} justifyContent="center">
            {restaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} />
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}
    </Box>
  );
};

export default Restaurant;