import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Box,
  Container,
} from "@mui/material";

const Header = ({ city, setCity }) => {
  const cities = ["Hyderabad", "Chennai", "Mumbai", "Bangalore"];

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Title */}
          <Typography variant="h6" component="div">
            Crave Corner
          </Typography>

          {/* City Selector */}
          <Select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            size="small"
            displayEmpty
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="" disabled>
              Select City
            </MenuItem>
            {cities.map((cityName) => (
              <MenuItem key={cityName} value={cityName}>
                {cityName}
              </MenuItem>
            ))}
          </Select>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
