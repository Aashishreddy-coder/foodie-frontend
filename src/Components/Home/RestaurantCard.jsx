import { Card, CardContent, Typography, Button } from "@mui/material";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Card sx={{ maxWidth: 300, margin: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6">{restaurant.restaurantName}</Typography>
        <Typography variant="body2">{restaurant.city}</Typography>
        <Typography variant="body2">{restaurant.distanceInKm}</Typography>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
