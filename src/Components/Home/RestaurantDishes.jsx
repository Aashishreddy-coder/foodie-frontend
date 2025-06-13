import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import DishCard from "./DishCard";
import { Box, Grid, Fade, TextField, Typography, useTheme, useMediaQuery } from "@mui/material";

const RestaurantDishes = () => {
  const { restaurantId, distance } = useParams();
  const [dishes, setDishes] = useState([]);
  const [search, setSearch] = useState("");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchRestaurantDishes = async () => {
      try {
        const response = await axiosInstance.get(
          `/dishes/restaurant/${restaurantId}?distanceInKm=${distance}`
        );
        setDishes(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching restaurant dishes:", error);
      }
    };
    fetchRestaurantDishes();
  }, [restaurantId, distance]);

  const filteredDishes = dishes.filter((dish) =>
    dish.name.toLowerCase().includes(search.toLowerCase())
  );

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
      {/* Title */}
      <Typography
        variant={isMobile ? "h6" : "h5"}
        color="primary"
        fontWeight={600}
        gutterBottom
        textAlign={"center"}
      >
        Restaurant Dishes
      </Typography>

      {/* Search Bar */}
      <Box sx={{ my: 2, display: "flex", justifyContent: "center" }}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Dishes..."
          variant="outlined"
          fullWidth
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
          {filteredDishes.map((dish) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
              <DishCard dish={dish} />
            </Grid>
          ))}
        </Grid>
      </Fade>
    </Box>
  );
};

export default RestaurantDishes;
