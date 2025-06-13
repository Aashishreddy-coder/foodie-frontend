import { Card, CardContent, Typography, Fade } from "@mui/material";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Fade in timeout={800}>
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
          <CardContent >
            <Typography variant="h6" color="primary" gutterBottom sx={{ fontWeight: 600 }}>
              {restaurant.restaurantName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {restaurant.city}
            </Typography>
            <Typography variant="body2" color="text.secondary" >
              {parseFloat(restaurant.distanceInKm).toFixed(2)} km away
            </Typography>
          </CardContent>
        </Card>
      </Link>
    </Fade>
  );
};

export default RestaurantCard;
