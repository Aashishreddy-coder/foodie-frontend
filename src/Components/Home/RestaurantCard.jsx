import { Card, CardContent, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      style={{ textDecoration: "none" }}
      to={`/home/restaurant/${restaurant.id}/${restaurant.distanceInKm}`}
    >
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
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
        >
          <Typography
            variant="h6"
            color="primary"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {restaurant.restaurantName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            City: {restaurant.city}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {parseFloat(restaurant.distanceInKm).toFixed(2)} km away
          </Typography>

          {/* Optional: Add image if available */}
          {restaurant.image && (
            <Box
              component="img"
              src={restaurant.image}
              alt={restaurant.restaurantName}
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
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
