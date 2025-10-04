import "./App.css";
import React from "react";
import LoginComponent from "./Components/Auth/LoginComponent";
import RegisterForm from "./Components/Auth/RegisterForm";
import { Routes, Route } from "react-router-dom";
import HomeComponent from "./Components/Home/HomeComponent";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import Restaurant from "./Components/Home/Restaurant";
import Dish from "./Components/Home/Dish";
import Favorites from "./Components/Home/Favorites";
import Orders from "./Components/Home/Orders";
import MainLayout from "./Components/Home/MainLayout";
import RestaurantDishes from "./Components/Home/RestaurantDishes";
import Delivery from "./Components/Home/Delivery";
import Profile from "./Components/Home/Profile";
import { Navigate } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Protected Routes with MainLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/home" />} />
          <Route path="home" element={<HomeComponent />}>
            <Route index element={<Restaurant />} />
            <Route path="restaurant" element={<Restaurant />} />
            <Route
              path="/home/restaurant/:restaurantId/:distance"
              element={<RestaurantDishes />}
            />
            <Route path="dish" element={<Dish />} />
          </Route>
          <Route path="favorites" element={<Favorites />} />
          <Route path="orders" element={<Orders />} />
          <Route path="delivery" element={<Delivery />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
