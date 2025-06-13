import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import { useState } from "react";
import {
  Favorite,
  ShoppingCart,
  Home,
  DeliveryDining,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const BottomNavigationComponent = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [value, setValue] = useState(0);

  return (
    <Paper sx={{ 
      position: "fixed", 
      bottom: 0, 
      left: 0, 
      right: 0,
      boxShadow: "0 -2px 8px rgba(0,0,0,0.05)",
      }}
      elevation={3}
      >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          navigate(newValue);
        }}
        sx={{ 
          backgroundColor: "background.navbar", 
          borderTop: `1px solid ${theme.palette.divider}`,
          "& .Mui-selected": {
            color: theme.palette.primary.main,
          },
          "& .MuiBottomNavigationAction-root": {
            "&:hover": {
              color: theme.palette.primary.dark,
            },
          }
        }}
      >
        <BottomNavigationAction label="Home" value="home" icon={<Home />} />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<Favorite />}
        />
        <BottomNavigationAction
          label="Orders"
          value="orders"
          icon={<ShoppingCart />}
        />
        <BottomNavigationAction
          label="Delivery"
          value="delivery"
          icon={<DeliveryDining />}
        />
      </BottomNavigation>
    </Paper>
  );
};
export default BottomNavigationComponent;
