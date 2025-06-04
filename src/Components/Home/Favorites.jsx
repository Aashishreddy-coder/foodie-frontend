import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axiosInstance.get("/api/favourites/getall");
        setFavorites(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No favorites found.");
          setFavorites([]); // empty state
        } else {
          console.log(error);
        }
      }
    };
    fetchFavorites();
  }, []);

  return (
    <div>
      <h1>Favorites</h1>
      {favorites.length === 0 && <h2>No favorites found.</h2>}
      {favorites.map((favorite) => (
        <div key={favorite.id}>
          <h2>{favorite.dishId}</h2>
          <h2>{favorite.userEmail}</h2>
        </div>
      ))}
    </div>
  );
};

export default Favorites;
