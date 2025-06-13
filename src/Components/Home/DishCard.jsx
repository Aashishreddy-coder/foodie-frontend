import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Box,
  Fade,
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

      const response = await axiosInstance.post(
        `/api/orders/add?restaurantId=${dish.restaurantId}`,
        orderItem
      );
      console.log(response.data);
      setOrderSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError(
          "Cannot add items from different restaurants to the same order"
        );
        setShowError(true);
      } else {
        setError("Failed to add item to order. Please try again.");
        setShowError(true);
      }
      console.error("Error adding to order:", error);
    }
  };

  const addFavorite = async () => {
    try {
      const response = await axiosInstance.post("/api/favourites/save", {
        dishId: dish.id,
      });
      console.log(response.data);
      setFavSuccess(true);
    } catch (error) {
      console.error("Error adding to favorites:", error);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleCloseOrderSuccess = () => {
    setOrderSuccess(false);
  }
  const handleCloseFavSuccess = () => {
    setFavSuccess(false);
  };

  return (
    <>
      <Fade in timeout={800}>
        <Card sx={{ 
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
          }}>
          <CardContent sx={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: 1,
            }}>
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              {dish.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dish.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ₹{parseFloat(dish.price).toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {dish.restaurantName}
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

            <Box sx={{display: "flex", justifyContent: "space-between", mt: 1}}>
              <Tooltip title="Order" arrow>
                <IconButton color="primary" aria-label="add to shopping cart" onClick={addOrder}>
                  <AddShoppingCart />
                </IconButton>
              </Tooltip>

              <Tooltip title="Favorite" arrow>
                <IconButton color="primary" aria-label="add to favorites" onClick={addFavorite}>
                  <Favorite />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>
      </Fade>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }} >
          {error}
        </Alert>
      </Snackbar>

      {/* Order Success Snackbar */}
      <Snackbar
        open={orderSuccess}
        autoHideDuration={4000}
        onClose={handleCloseOrderSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseOrderSuccess} severity="success" sx={{ width: "100%" }}>
          Dish added to Orders
        </Alert>
      </Snackbar>

      {/* Favourite Success Snackbar */}
      <Snackbar
        open={favSuccess}
        autoHideDuration={4000}
        onClose={handleCloseFavSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseFavSuccess} severity="success" sx={{ width: "100%" }}>
          Dish added to favourites
        </Alert>
      </Snackbar>
    </>
  );
};

export default DishCard;
