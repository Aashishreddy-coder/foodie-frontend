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
  };
  const handleCloseFavSuccess = () => {
    setFavSuccess(false);
  };

  return (
    <>
      <Card sx={{ minWidth: 300, margin: 2, padding: 2 }}>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="h6">{dish.name}</Typography>
          <Typography variant="body2">{dish.description}</Typography>
          <Typography variant="body2">{dish.price}</Typography>
          <Typography variant="body2">{dish.restaurantName}</Typography>
          <Typography variant="body2">{dish.distanceInKm}</Typography>
          <Typography variant="body2">{dish.cuisine}</Typography>
          <img src={dish.image} alt={dish.name} />
          <IconButton
            color="primary"
            aria-label="add to shopping cart"
            onClick={addOrder}
          >
            <AddShoppingCart />
          </IconButton>

          <IconButton
            color="primary"
            aria-label="add to favorites"
            onClick={async () => {
              try {
                const response = await axiosInstance.post(
                  "/api/favourites/save",
                  {
                    dishId: dish.id,
                  }
                );
                console.log(response.data);
              } catch (error) {
                console.log(error);
              }
            }}
          >
            <Favorite />
          </IconButton>
        </CardContent>
      </Card>

      {/* Error Snackbar */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
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
        <Alert
          onClose={handleCloseOrderSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
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
        <Alert
          onClose={handleCloseFavSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          Dish added to favourites
        </Alert>
      </Snackbar>
    </>
  );
};

export default DishCard;
