import React, { useState, useEffect, useContext } from "react";
import { LocationContext } from "./HomeComponent";
import axiosInstance from "../../utils/axios";
import DishCard from "./DishCard";
import {
  TextField,
  Box,
  Grid,
  Fade,
  Typography,
  useMediaQuery,
  useTheme
} from "@mui/material";

const Dish = () => {
  const { city, latitude, longitude } = useContext(LocationContext);
  const [dishes, setDishes] = useState([]);
  const [search, setSearch] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await axiosInstance.get("/dishes/search", {
          params: {
            name: search,
            latitude,
            longitude,
            city,
          },
        });
        setDishes(response.data);
      } catch (error) {
        console.error("Error fetching dishes:", error);
      }
    };

    fetchDishes();
  }, [search, city, latitude, longitude]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        mx: { xs: 1, md: "auto" },
        maxWidth: "1200px",
        backgroundColor: "background.container",
        borderRadius: 4,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        mt: 2,
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
          Explore Delicious Dishes 🍜
        </Typography>
      </Fade>

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
      {dishes.length === 0 ? (
        <Fade in timeout={800}>
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ mt: 4 }}
          >
            No dishes found.
          </Typography>
        </Fade>
      ) : (
        <Fade in timeout={800}>
          <Grid container spacing={3} justifyContent="center">
            {dishes.map((dish) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
                <DishCard dish={dish} />
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}
    </Box>
  );
};

export default Dish;
