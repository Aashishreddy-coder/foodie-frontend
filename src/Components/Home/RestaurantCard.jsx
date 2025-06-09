import { Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      style={{ textDecoration: "none" }}
      to={`/home/restaurant/${restaurant.id}/${restaurant.distanceInKm}`}
    >
      <Card sx={{ maxWidth: 300, margin: 2, padding: 2 }}>
        <CardContent>
          <Typography variant="h6">{restaurant.restaurantName}</Typography>
          <Typography variant="body2">{restaurant.city}</Typography>
          <Typography variant="body2">{restaurant.distanceInKm}</Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default RestaurantCard;
