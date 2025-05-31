import React, { useState } from "react"; // Add useState
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert, // Add Alert for error display
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";

const LoginComponent = () => {
  const [errorMessage, setErrorMessage] = useState(""); // Add state for error

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
      setErrorMessage(""); // Clear any previous errors
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data); // Set error message from backend
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
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={3}
          sx={{ p: 3, borderRadius: 2 }}
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Login
          </Typography>

          {/* Add error message display */}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <TextField
            fullWidth
            type="email"
            label="Email"
            {...register("email", { required: "Email is required" })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            {...register("password", { required: "Password is required" })}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 2 }} // Add margin bottom
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginComponent;
