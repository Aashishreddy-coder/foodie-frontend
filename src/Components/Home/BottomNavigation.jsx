import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useState } from "react";
import {
  Restaurant,
  RestaurantMenu,
  Favorite,
  ShoppingCart,
  Home,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const BottomNavigationComponent = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(newValue);
        }}
      >
        <BottomNavigationAction label="Home" value="/home" icon={<Home />} />
        <BottomNavigationAction
          label="Favorites"
          value="/favorites"
          icon={<Favorite />}
        />
        <BottomNavigationAction
          label="Orders"
          value="/orders"
          icon={<ShoppingCart />}
        />
      </BottomNavigation>
    </Paper>
  );
};
export default BottomNavigationComponent;
