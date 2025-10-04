import React, { useState } from "react"; // Add useState
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert, // Add Alert for error display
  Collapse,
  Grow,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginComponent = () => {
  const [errorMessage, setErrorMessage] = useState("");
  // Add state for error
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({ mode: "onBlur" });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8085/api/users/login",
        data
      );
      console.log(response.data);
      localStorage.setItem("token", response.data);
      setErrorMessage("");
      navigate("/home");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.default",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Grow in timeout={1000}>
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography
              variant="h5"
              component="h1"
              align="center"
              color="primary"
              fontWeight="bold"
            >
              Welcome Back 👋
            </Typography>
            <Typography
              variant="body2"
              align="center"
              color="secondary"
              sx={{ mb: 1 }}
            >
              Please login to continue
            </Typography>

            <Collapse in={!!errorMessage}>
              <Alert severity="error" color="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            </Collapse>

            <TextField
              fullWidth
              type="email"
              label="Email"
              color="primary"
              {...register("email", { required: "Email is required" })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              color="primary"
              {...register("password", { required: "Password is required" })}
              error={!!errors.password}
              helperText={errors.password?.message}
              // Add margin bottom
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              color="primary"
            >
              Login
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/register")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Register
              </Button>
            </Typography>
          </Paper>
        </Grow>
      </Container>
    </Box>
  );
};

export default LoginComponent;
