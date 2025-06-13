import { useEffect, useState, useContext } from "react";
import axiosInstance from "../../utils/axios";
import { Card, CardContent, Typography, IconButton, Tooltip, Box,
  Grid, Fade, Snackbar, Alert, useTheme, useMediaQuery
 } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { cityContext } from "./MainLayout";

const Favorites = () => {
  const { latitude, longitude } = useContext(cityContext);
  const [favorites, setFavorites] = useState([]);
  const [dishDetails, setDishDetails] = useState([]);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDelete = async (favoriteId) => {
    try {
      await axiosInstance.delete(`/api/favourites/delete/${favoriteId}`);
      setFavorites(favorites.filter((fav) => fav.id !== favoriteId));
      const favoriteToDelete = favorites.find((fav) => fav.id === favoriteId);
      if (favoriteToDelete) {
        setDishDetails(
          dishDetails.filter((dish) => dish.id !== favoriteToDelete.dishId)
        );
      }
      setSuccessMessage("Dish removed from favourites.");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error deleting favorite:", error);
      setError("Failed to delete favorite. Please try again.");
      setShowError(true);
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  useEffect(() => {
    const fetchFavoritesAndDishes = async () => {
      try {
        // 1. Fetch favorites
        const favResponse = await axiosInstance.get("/api/favourites/getall");
        const favs = favResponse.data;
        setFavorites(favs);

        // 2. Create promises for all dish fetches
        const dishPromises = favs.map((favorite) =>
          axiosInstance
            .get(
              `/dishes/${favorite.dishId}?latitude=${latitude}&longitude=${longitude}`
            )
            .then((response) => response.data)
            .catch((error) => {
              console.error(`Error fetching dish ${favorite.dishId}:`, error);
              return null;
            })
        );

        // 3. Wait for all dish fetches to complete
        const allDishDetails = await Promise.all(dishPromises);

        // 4. Filter out any failed requests and set the state
        setDishDetails(allDishDetails.filter((dish) => dish !== null));
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No favorites found.");
          setFavorites([]);
        } else {
          console.log(error);
        }
      }
    };

    fetchFavoritesAndDishes();
  }, [latitude, longitude]);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        mx: { xs: 1, md: "auto" },
        maxWidth: "1200px",
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
          fontWeight="Bold"
          gutterBottom
          sx={{ textAlign: "center", mb: 3 }}
        >
          Your Favorite Dishes ❤️
        </Typography>
      </Fade>

      {dishDetails.length === 0 ? (
        <Fade in timeout={800}>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center"
            sx={{ mt: 4 }}
          >
            No favorite dishes found.
          </Typography>
        </Fade>
      ) : (
        <Fade in timeout={800}>
          <Grid container spacing={3} justifyContent="center">
            {dishDetails.map((dish, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={dish.id}>
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
                      sx={{ fontWeight: 600}}
                    >
                      {dish.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {dish.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ₹{parseFloat(dish.price).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Restaurant: {dish.restaurantName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {parseFloat(dish.distanceInKm).toFixed(2)} km away
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cuisine: {dish.cuisine}
                    </Typography>

                    {dish.image && (
                      <Box
                        component="img"
                        src={dish.image}
                        alt={dish.name}
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

                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          onClick={() => handleDelete(favorites[index].id)}
                          color="error"
                          aria-label="delete favorite"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Fade>
      )}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseError} 
          severity="error" 
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert 
          onClose={handleCloseSuccess} 
          severity="success" 
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Favorites;
