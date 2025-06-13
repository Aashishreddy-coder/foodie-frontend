import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import { useSearchParams } from "react-router-dom";
import {
  Box,
  Typography,
  Divider,
  Alert,
  Fade,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const Delivery = () => {
  const [searchParams] = useSearchParams();
  const [pendingDelivery, setPendingDelivery] = useState([]);
  const [completedDelivery, setCompletedDelivery] = useState([]);
  const [error, setError] = useState(null);
  const sessionId = searchParams.get("session_id");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Function to check and update delivery status
  const checkDeliveryTime = async (delivery) => {
    const currentTime = new Date();
    const deliveryTime = new Date(delivery.deliveryTime);

    if (currentTime >= deliveryTime) {
      try {
        // Update status to COMPLETED in backend
        await axiosInstance.put(
          `/delivery/${delivery.id}/status?status=completed`
        );

        // Update local state
        setPendingDelivery((prev) => prev.filter((d) => d.id !== delivery.id));
        setCompletedDelivery((prev) => [
          ...prev,
          { ...delivery, deliveryStatus: "COMPLETED" },
        ]);
      } catch (error) {
        console.error("Error updating delivery status:", error);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // If we have a session ID, fetch session data first
        if (sessionId) {
          const sessionResponse = await axiosInstance.get(
            `/delivery/session/${sessionId}`
          );
          console.log("Session delivery response:", sessionResponse.data);

          const deleteOrder = await axiosInstance.delete(`/api/orders/clear`);
          console.log("Order deleted:", deleteOrder.data);
        }

        // Always fetch both pending and completed deliveries
        const pendingDeliveryResponse = await axiosInstance.get(
          `/delivery/delivery-status?deliveryStatus=PENDING`
        );
        const completedDeliveryResponse = await axiosInstance.get(
          `/delivery/delivery-status?deliveryStatus=COMPLETED`
        );

        setPendingDelivery(pendingDeliveryResponse.data);
        setCompletedDelivery(completedDeliveryResponse.data);

        // Check each pending delivery's time
        pendingDeliveryResponse.data.forEach((delivery) => {
          checkDeliveryTime(delivery);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to fetch data");
      }
    };

    fetchData();
  }, [sessionId]); // Only re-run when sessionId changes

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        mx: { xs: 1, md: "auto" },
        maxWidth: "900px",
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
          sx={{ textAlign: "center" }}
        >
          Delivery Status
        </Typography>
      </Fade>

      {error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          {pendingDelivery.length > 0 && (
            <div>
              <h2>Pending Deliveries</h2>
              {pendingDelivery.map((delivery, index) => (
                <div key={index}>
                  <p>Id: {delivery.id}</p>
                  <p>Status: {delivery.deliveryStatus}</p>
                  <p>Restaurant: {delivery.restaurantName}</p>
                  <p>Address: {delivery.deliveryAddress}</p>
                  <p>Distance: {delivery.distance} km</p>
                  <p>Estimated Time: {delivery.time} minutes</p>
                  <p>Order ID: {delivery.orderId}</p>
                  <p>
                    Delivery Time:{" "}
                    {new Date(delivery.deliveryTime).toLocaleString()}
                  </p>
                  <p>Items: {delivery.items}</p>
                  <hr />
                </div>
              ))}
            </div>
          )}

          <Divider sx={{ my: 4 }} />

          {completedDelivery.length > 0 && (
            <div>
              <h2>Completed Deliveries</h2>
              {completedDelivery.map((delivery, index) => (
                <div key={index}>
                  <p>Id: {delivery.id}</p>
                  <p>Status: {delivery.deliveryStatus}</p>
                  <p>Restaurant: {delivery.restaurantName}</p>
                  <p>Address: {delivery.deliveryAddress}</p>
                  <p>Distance: {delivery.distance} km</p>
                  <p>Estimated Time: {delivery.time} minutes</p>
                  <p>Order ID: {delivery.orderId}</p>
                  <p>
                    Delivery Time:{" "}
                    {new Date(delivery.deliveryTime).toLocaleString()}
                  </p>
                  <p>Items: {delivery.items}</p>
                  <hr />
                </div>
              ))}
            </Box>
          </Fade>
          )}

          {pendingDelivery.length === 0 && completedDelivery.length === 0 && (
            <Fade in timeout={800}>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ mt: 4 }}
              >
                No deliveries found.
              </Typography>
            </Fade>
          )}
        </>
      )}
    </Box>
  );
};

export default Delivery;
