import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { LocationContext } from "./HomeComponent";
import axiosInstance from "../../utils/axios";
import RestaurantCard from "./RestaurantCard";
import { TextField, Box, Grid, Fade } from "@mui/material";

const Restaurant = () => {
  const { city, latitude, longitude } = useContext(LocationContext);
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  const searchRestaurants = async () => {
    try {
      const response = await axiosInstance.get("/restaurants/nearby", {
        params: {
          name: search,
          latitude: latitude,
          longitude: longitude,
          city: city,
        },
      });
      console.log(response.data);
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    searchRestaurants();
  }, [search, city, latitude, longitude]);

  return (
    <div>
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
        <Fade in timeout={800}>
          <Grid container spacing={3} justifyContent={"center"}>
            {restaurants.map((restaurant) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={restaurant.id}>
                <RestaurantCard restaurant={restaurant} />
              </Grid>
            ))}
          </Grid>
        </Fade>
      </Box>
    </div>
  );
};

export default Restaurant;
