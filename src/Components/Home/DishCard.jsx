import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
import { AddShoppingCart, Favorite } from "@mui/icons-material";
import axiosInstance from "../../utils/axios";
import { useState } from "react";

const DishCard = ({ dish }) => {
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [favSuccess, setFavSuccess] = useState(false);

  const addOrder = async () => {
    try {
      const orderItem = {
        dishId: dish.id,
        dishName: dish.name,
        price: parseFloat(dish.price),
        quantity: 1,
      };

      await axiosInstance.post(
        `/api/orders/add?restaurantId=${dish.restaurantId}`,
        orderItem
      );
      setOrderSuccess(true);
    } catch (error) {
      if (error.response?.status === 400) {
        setError(
          "Cannot add items from different restaurants to the same order"
        );
      } else {
        setError("Failed to add item to order. Please try again.");
      }
      setShowError(true);
    }
  };

  const addFavorite = async () => {
    try {
      await axiosInstance.post("/api/favourites/save", {
        dishId: dish.id,
      });
      setFavSuccess(true);
    } catch (error) {
      setError("Failed to add to favorites. Please try again.");
      setShowError(true);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 16px rgba(0,0,0,0.15)",
          },
          p: 2,
          backgroundColor: "background.paper",
        }}
      >
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography
            variant="h6"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {dish.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {dish.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ₹{parseFloat(dish.price).toFixed(2)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Restaurant: {dish.restaurantName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {parseFloat(dish.distanceInKm).toFixed(2)} km away
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Cuisine: {dish.cuisine}
          </Typography>

          {dish.image && (
            <Box
              component="img"
              src={dish.image}
              alt={dish.name}
              sx={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: 2,
                mt: 1,
                mb: 1,
              }}
            />
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
            <Tooltip title="Add to Orders" arrow>
              <IconButton color="primary" onClick={addOrder}>
                <AddShoppingCart />
              </IconButton>
            </Tooltip>

            <Tooltip title="Add to Favourites" arrow>
              <IconButton color="error" onClick={addFavorite}>
                <Favorite />
              </IconButton>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>

      {/* Snackbars */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setShowError(false)} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={orderSuccess}
        autoHideDuration={4000}
        onClose={() => setOrderSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setOrderSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Dish added to orders
        </Alert>
      </Snackbar>

      <Snackbar
        open={favSuccess}
        autoHideDuration={4000}
        onClose={() => setFavSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setFavSuccess(false)} severity="success" sx={{ width: "100%" }}>
          Dish added to favourites
        </Alert>
      </Snackbar>
    </>
  );
};

export default DishCard;
