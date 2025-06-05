import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../utils/axios";
import { Card, CardContent, Typography, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { cityContext } from "./MainLayout";

const Favorites = () => {
  const { latitude, longitude } = useContext(cityContext);
  const [favorites, setFavorites] = useState([]);
  const [dishDetails, setDishDetails] = useState([]);

  const handleDelete = async (favoriteId) => {
    try {
      await axiosInstance.delete(`/api/favourites/delete/${favoriteId}`);
      // Remove the deleted favorite from both states
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      // Find the dishId for this favorite and remove it from dishDetails
      const favoriteToDelete = favorites.find((fav) => fav.id === favoriteId);
      if (favoriteToDelete) {
        setDishDetails(
          dishDetails.filter((dish) => dish.id !== favoriteToDelete.dishId)
        );
      }
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        // First get all favorites
        const response = await axiosInstance.get("/api/favourites/getall");
        setFavorites(response.data);

        // Then get dish details for each favorite
        const allDishDetails = [];
        for (const favorite of response.data) {
          try {
            const dishResponse = await axiosInstance.get(
              `/dishes/${favorite.dishId}?latitude=${latitude}&longitude=${longitude}`
            );
            allDishDetails.push(dishResponse.data);
          } catch (error) {
            console.error(`Error fetching dish ${favorite.dishId}:`, error);
          }
        }
        setDishDetails(allDishDetails);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No favorites found.");
          setFavorites([]);
        } else {
          console.log(error);
        }
      }
    };
    fetchFavorites();
  }, [latitude, longitude]);

  return (
    <div>
      <h1>Favorites</h1>
      {dishDetails.length === 0 && <h2>No favorites found.</h2>}
      {dishDetails.map((dish, index) => (
        <Card key={dish.id} sx={{ minWidth: 300, margin: 2, padding: 2 }}>
          <CardContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <Typography variant="h6">{dish.name}</Typography>
                <Typography variant="body2">{dish.description}</Typography>
                <Typography variant="body2">Price: {dish.price}</Typography>
                <Typography variant="body2">
                  Restaurant: {dish.restaurantName}
                </Typography>
                <Typography variant="body2">
                  Distance: {dish.distanceInKm} km
                </Typography>
                <Typography variant="body2">Cuisine: {dish.cuisine}</Typography>
                {dish.image && (
                  <img
                    src={dish.image}
                    alt={dish.name}
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                )}
              </div>
              <IconButton
                onClick={() => handleDelete(favorites[index].id)}
                color="error"
                aria-label="delete favorite"
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Favorites;
