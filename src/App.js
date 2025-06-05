import "./App.css";
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
          <Route path="/home" element={<HomeComponent />}>
            <Route path="restaurant" element={<Restaurant />} />
            <Route
              path="/home/restaurant/:restaurantId/:distance"
              element={<RestaurantDishes />}
            />
            <Route path="dish" element={<Dish />} />
          </Route>
          <Route path="favorites" element={<Favorites />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
