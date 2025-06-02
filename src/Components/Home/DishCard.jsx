import { Card, CardContent, Typography, Image } from "@mui/material";

const DishCard = ({ dish }) => {
  return (
    <Card sx={{ minWidth: 300, margin: 2, padding: 2 }}>
      <CardContent>
        <Typography variant="h6">{dish.name}</Typography>
        <Typography variant="body2">{dish.description}</Typography>
        <Typography variant="body2">{dish.price}</Typography>
        <Typography variant="body2">{dish.restaurantName}</Typography>
        <Typography variant="body2">{dish.distanceInKm}</Typography>
        <Typography variant="body2">{dish.cuisine}</Typography>
        <img src={dish.image} alt={dish.name} />
      </CardContent>
    </Card>
  );
};

export default DishCard;
