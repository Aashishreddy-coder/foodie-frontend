import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { LocationContext } from "./HomeComponent";
import axiosInstance from "../../utils/axios";
import RestaurantCard from "./RestaurantCard";

const Restaurant = () => {
  const { city, latitude, longitude } = useContext(LocationContext);
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState("");

  const searchRestaurants = async () => {
    try {
      const response = await axiosInstance.get("/restaurants/nearby", {
        params: {
          name: search,
          latitude: latitude,
          longitude: longitude,
          city: city,
        },
      });
      console.log(response.data);
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  useEffect(() => {
    searchRestaurants();
  }, [search, city, latitude, longitude]);

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search restaurants..."
      />
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
};

export default Restaurant;
