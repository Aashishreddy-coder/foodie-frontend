import "./App.css";
import LoginComponent from "./Components/Auth/LoginComponent";
import RegisterForm from "./Components/Auth/RegisterForm";
import { Routes, Route } from "react-router-dom";
import HomeComponent from "./Components/Home/HomeComponent";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import Restaurant from "./Components/Home/Restaurant";
import Dish from "./Components/Home/Dish";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomeComponent />
            </ProtectedRoute>
          }
        >
          <Route path="restaurant" element={<Restaurant />} />
          <Route path="dish" element={<Dish />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
