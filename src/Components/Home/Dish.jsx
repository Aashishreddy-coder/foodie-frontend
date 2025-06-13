import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { LocationContext } from "./HomeComponent";
import axiosInstance from "../../utils/axios";
import DishCard from "./DishCard";
import { TextField, Box, Grid, Fade } from "@mui/material";

const Dish = () => {
  const { city, latitude, longitude } = useContext(LocationContext);
  const [dishes, setDishes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const fetchDishes = async () => {
        const response = await axiosInstance.get("/dishes/search", {
          params: {
            name: search,
            latitude: latitude,
            longitude: longitude,
            city: city,
          },
        });
        console.log(response.data);
        setDishes(response.data);
      };

      fetchDishes();
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  }, [search, city, latitude, longitude]);

  return (
    <Box
      sx={{
        backgroundColor: "background.default",
        minHeight: "100vh",
        px: { xs: 2, md: 3 },
        py: 3,
      }}
    >
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
            placeholder="Search Dishes..."
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

        {/* Dish Cards */}
        <Fade in timeout={800}>
          <Grid container spacing={3} justifyContent={"center"}>
            {dishes.map((dish) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
                <DishCard dish={dish} />
              </Grid>
            ))}
          </Grid>
        </Fade>
      </Box>
    </Box>
  );
};

export default Dish;
