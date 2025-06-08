import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  ButtonGroup,
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MapSelector from "./MapSelector";

const Orders = () => {
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [payment, setPayment] = useState(null);

  const handlePayment = async () => {
    try {
      const response = await axiosInstance.post("/payment/checkout", {
        amount: order.totalAmount * 100,
        currency: "INR",
        name: restaurant.restaurantName,
        quantity: 1,
      });
      console.log(response.data);

      setPayment(response.data);
      window.location.href = response.data.sessionUrl;
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchOrderAndRestaurant = async () => {
      try {
        // Fetch order
        const orderResponse = await axiosInstance.get("/api/orders/get");
        const orderData = orderResponse.data.data;
        setOrder(orderData);

        // Fetch restaurant details
        if (orderData.restaurantId) {
          const restaurantResponse = await axiosInstance.get(
            `/restaurants/${orderData.restaurantId}`
          );
          setRestaurant(restaurantResponse.data);
        }
      } catch (error) {
        if (error.response.status === 404) {
          setOrder(null);
          setRestaurant(null);
        }
        console.error("Error fetching data:", error);
      }
    };

    fetchOrderAndRestaurant();
  }, []);

  const handleQuantityChange = async (dishId, change) => {
    try {
      const response = await axiosInstance.put(
        `/api/orders/update?dishId=${dishId}&action=${change}`
      );
      setOrder(response.data.data);
    } catch (error) {
      if (error.response?.status === 404) {
        setOrder(null);
        setRestaurant(null);
      }
      console.error("Error updating quantity:", error);
    }
  };

  if (!order) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  return (
    <div>
      <h1>Your Order</h1>
      <Card sx={{ margin: 2, padding: 2 }}>
        <CardContent>
          <Typography variant="h6">Order ID: {order.id}</Typography>
          <Typography variant="body2">Email: {order.userEmail}</Typography>
          <Typography variant="body2">
            Restaurant: {restaurant ? restaurant.restaurantName : "Loading..."}
          </Typography>
          <Typography variant="body2">
            Restaurant ID: {order.restaurantId}
          </Typography>
          <Typography variant="body2">
            Pending: {order.paymentStatus}
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Items:</Typography>
            {order.items.map((item, index) => (
              <Box key={index} sx={{ ml: 2, mt: 1 }}>
                <Typography variant="body1">{item.dishName}</Typography>
                <Typography variant="body2">Price: ₹{item.price}</Typography>
                <Typography variant="body2">
                  Quantity: {item.quantity}
                </Typography>

                <ButtonGroup
                  disableElevation
                  variant="contained"
                  aria-label="Disabled button group"
                >
                  <Button
                    onClick={() =>
                      handleQuantityChange(item.dishId, "decrement")
                    }
                  >
                    -
                  </Button>

                  <Button
                    onClick={() =>
                      handleQuantityChange(item.dishId, "increment")
                    }
                  >
                    +
                  </Button>
                </ButtonGroup>
              </Box>
            ))}
          </Box>

          <MapSelector restaurantId={order.restaurantId} />

          <Button
            variant="contained"
            endIcon={<CurrencyRupeeIcon />}
            onClick={handlePayment}
          >
            {`Total Amount: ${order.totalAmount}`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Orders;
