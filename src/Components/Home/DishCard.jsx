import { Card, CardContent, Typography, IconButton } from "@mui/material";
import { AddShoppingCart, Favorite } from "@mui/icons-material";
import axiosInstance from "../../utils/axios";

const DishCard = ({ dish }) => {
  return (
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
          onClick={() => {
            console.log("add to shopping cart");
          }}
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
  );
};

export default DishCard;
