import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
  Box,
  Container,
  Slide,
  useTheme,
  useMediaQuery,
  IconButton,
  Menu,
  Avatar,
  Divider,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";

const Header = ({ city, setCity }) => {
  const cities = ["Hyderabad", "Chennai", "Mumbai", "Bangalore"];
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // User Menu state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Menu actions (you can implement logic later)
  const handleProfile = () => {
    console.log("Profile clicked");
    handleMenuClose();
  };
  const handleAccount = () => {
    console.log("Account clicked");
    handleMenuClose();
  };
  const handleLogout = () => {
    console.log("Logout clicked");
    // Clear token and redirect to login
    localStorage.removeItem("token");
    navigate("/login");
    handleMenuClose();
  };

  return (
    <Slide in={true} direction="down" timeout={800}>
      <AppBar
        position="static"
        color="primary"
        elevation={4}
        sx={{
          backgroundColor: "primary.main",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              py: isMobile ? 0.5 : 1,
            }}
          >
            {/* Title */}
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: "0.5px",
                color: "primary.contrastText",
              }}
            >
              🍽️ Crave Corner
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* City Selector */}
              <Select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                size="small"
                displayEmpty
                sx={{
                  minWidth: isMobile ? 100 : 150,
                  backgroundColor: "background.paper",
                  borderRadius: 2,
                  "& .MuiSelect-select": {
                    py: 1,
                    px: 2,
                  },
                }}
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

              {/* User Menu */}
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                size="large"
              >
                <AccountCircleIcon sx={{fontSize: isMobile ? 28 : 32}} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                <MenuItem onClick={handleAccount}>Account</MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Slide>
  );
};

export default Header;
