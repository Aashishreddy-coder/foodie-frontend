import { useContext, useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  ButtonGroup,
  Fade,
  Stack,
  Divider,
} from "@mui/material";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import MapSelector from "./MapSelector";

const Orders = () => {
  const [order, setOrder] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [payment, setPayment] = useState(null);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const [distance, setDistance] = useState(null);
  const [address, setAddress] = useState(null);
  const [time, setTime] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await axiosInstance.post("/payment/checkout", {
        amount: order.totalAmount * 100,
        currency: "INR",
        name: restaurant.restaurantName,
        quantity: 1,
        restaurantId: order.restaurantId,
        restaurantName: restaurant.restaurantName,
        address: address,
        distance: distance,
        orderId: order.id,
        orderItems: JSON.stringify(order.items),
        time: time,
      });

      console.log("Payment response:", response.data);

      if (response.data && response.data.sessionUrl) {
        setPayment(response.data);
        // Use replace instead of href for better handling
        window.location.replace(response.data.sessionUrl);
      } else {
        console.error("Invalid payment session response:", response.data);
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      // You might want to show an error message to the user here
    } finally {
      setIsProcessing(false);
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
    return (
      <Box sx={{ textAlign: "center", my: 4 }}>
        <Fade in timeout={800}>
          <Typography variant="h6" color="text.secondary">
            Your orders is empty, add something from the menu.
          </Typography>
        </Fade>
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box 
        sx={{ 
          backgroundColor: "background.container",
          p: { xs: 2, md: 3 }, 
          borderRadius: 4,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          mt: 2,
          mx: { xs: 1, md: "auto" },
          maxWidth: "900px",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          color="primary"
          fontWeight={600}
          gutterBottom
        >
          Your Orders
        </Typography>

        <Card
          sx={{ 
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: "0 8px 16px rgba(0,0,0,0.12)",
            },
            p: 2,
            backgroundColor: "background.paper",
          }}
        >
          <CardContent>
            <Typography variant="body1" gutterBottom>
              <strong>Order ID:</strong> {order.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {order.userEmail}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Restaurant: {restaurant ? restaurant.restaurantName : "Loading..."}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Restaurant ID: {order.restaurantId}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Payment Status: {order.paymentStatus}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Items (total - {order.items.reduce((count, item) => count + item.quantity, 0)}):
            </Typography>

            <Stack spacing={2}>
              {order.items.map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    backgroundColor: "background.default",
                    borderRadius: 2,
                    p: 2,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
                  }}
                >
                  <Typography variant="body1" fontWeight={600}>
                    {item.dishName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Price: ₹{parseFloat(item.price).toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>

                  <ButtonGroup disableElevation variant="contained" sx={{ mt: 1 }} >
                    <Button
                      onClick={() =>
                        handleQuantityChange(item.dishId, "decrement")
                      }
                      size="large"
                    >
                      -
                    </Button>
                    <Button
                      onClick={() =>
                        handleQuantityChange(item.dishId, "increment")
                      }
                      size="medium"
                    >
                      +
                    </Button>
                  </ButtonGroup>
                </Box>
              ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <MapSelector
              restaurantId={order.restaurantId}
              onLocationValid={setIsLocationValid}
              distance={distance}
              address={address}
              setDistance={setDistance}
              setAddress={setAddress}
              setTime={setTime}
              time={time}
            />

            <Button
              variant="contained"
              onClick={handlePayment}
              size="large"
              sx={{ mt: 3 }}
              fullWidth
              disabled={!isLocationValid || isProcessing}
              endIcon={<CurrencyRupeeIcon />}
            >
              {isProcessing
                ? "Redirecting to Payment..."
                : isLocationValid
                ? `Pay ₹${parseFloat(order.totalAmount).toFixed(2)}`
                : "Select a valid delivery location to proceed"}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Fade>
  );
};

export default Orders;
