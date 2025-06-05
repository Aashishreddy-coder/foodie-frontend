import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axios";
import DishCard from "./DishCard";

const RestaurantDishes = () => {
  const { restaurantId, distance } = useParams();
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchRestaurantDishes = async () => {
      try {
        const response = await axiosInstance.get(
          `/dishes/restaurant/${restaurantId}?distanceInKm=${distance}`
        );
        setDishes(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching restaurant dishes:", error);
      }
    };
    fetchRestaurantDishes();
  }, [restaurantId, distance]);

  return (
    <div>
      <h1>Restaurant Dishes</h1>
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
};

export default RestaurantDishes;
