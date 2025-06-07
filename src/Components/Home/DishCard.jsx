import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { AddShoppingCart, Favorite } from "@mui/icons-material";
import axiosInstance from "../../utils/axios";
import { useState } from "react";

const DishCard = ({ dish }) => {
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

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

  const handleCloseError = () => {
    setShowError(false);
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
    </>
  );
};

export default DishCard;
