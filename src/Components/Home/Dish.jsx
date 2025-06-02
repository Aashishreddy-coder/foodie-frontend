import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { LocationContext } from "./HomeComponent";
import axiosInstance from "../../utils/axios";
import DishCard from "./DishCard";

const Dish = () => {
  const { city, latitude, longitude } = useContext(LocationContext);
  const [dishes, setDishes] = useState([]);

  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const fetchDishes = async () => {
        const response = await axiosInstance.get("/dishes/search", {
          params: {
            name: search,
            latitude: latitude,
            longitude: longitude,
            city: city,
          },
        });
        console.log(response.data);
        setDishes(response.data);
      };

      fetchDishes();
    } catch (error) {
      console.error("Error fetching dishes:", error);
    }
  }, [search, city, latitude, longitude]);
  return (
    <div>
      <h1>Dish</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search dishes..."
      />
      {dishes.map((dish) => (
        <DishCard key={dish.id} dish={dish} />
      ))}
    </div>
  );
};

export default Dish;
