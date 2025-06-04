import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({ mode: "onChange" });

  const onSubmit = async (data) => {
    try {
      const { name, email, password, phone, address } = data;

      const formData = new FormData();
      const userData = {
        name,
        email,
        password,
        phone,
        address,
      };

      formData.append("user", JSON.stringify(userData));
      formData.append("image", data.image[0]); // Append the image file

      // Make API call to register user
      const response = await axios.post(
        "http://localhost:8085/api/users/register",
        formData
      );

      console.log(response.data);
      setSuccessMessage("Registration successful!");
      setErrorMessage("");
      reset(); // Clear form
      setPreviewImage(null); // Reset preview image
      setSelectedFile(null); // Reset selected file

    } catch (error) {
      console.log("Full error:", error);
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
      setSuccessMessage("");
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
            Register
          </Typography>

          {/* Error and success messages */}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          {/* Name */}
          <TextField
            fullWidth
            label="Name"
            {...register("name", { 
              required: "Name is required",
              pattern: {
                value: /^[a-zA-Z\s]+$/,
                message: "Name must contain only letters and spaces",
              },
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters long",
              },
              maxLength: {
                value: 30,
                message: "Name must not exceed 30 characters",
              },
            })}
            error={!!errors.name}
            helperText={errors.name?.message}
            sx={{ mb: 2 }}
          />
          
          {/* Email */}
          <TextField
            fullWidth
            type="email"
            label="Email"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
                message: "Invalid email format",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            sx={{ mb: 2 }}
          />

          {/* Password */}
          <TextField
            fullWidth
            type="password"
            label="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;"'<>?,./\\|~`-]).{6,}$/,
                message:
                  "Password must contain uppercase, lowercase, digit, and special character",
              },
            })}
            error={!!errors.password}
            helperText={errors.password?.message}
            sx={{ mb: 2 }}
          />

          {/* Confirm Password */}
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === watch("password") || "Passwords do not match",
            })}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
            sx={{ mb: 2 }}
          />

          {/* Phone Number */}
          <TextField
            fullWidth
            type="tel"
            label="Phone"
            {...register("phone", { 
              required: "Phone number is required",
              pattern: {
              value: /^[0-9]{10}$/,
              message: "Phone number must be exactly 10 digits",
            },
            })}
            error={!!errors.phone}
            helperText={errors.phone?.message}
            sx={{ mb: 2 }}
          />

          {/* Address */}
          <TextField
            fullWidth
            label="Address"
            {...register("address", { 
              required: "Address is required",
              minLength: {
                value: 10,
                message: "Address must be at least 10 characters long",
              },
              maxLength: {
                value: 100,
                message: "Address must not exceed 100 characters",
              },
              validate: (value) =>
                value.trim().length > 0 || "Address cannot be empty or spaces only",
            })}
            error={!!errors.address}
            helperText={errors.address?.message}
            sx={{ mb: 2 }}
          />

          {/* Profile Image */}
          <Typography variant="body2" sx={{ mb: 1 }}>
            Profile Image (JPG, PNG, JPEG only) <span style={{ color: 'red' }}>*</span>
          </Typography>
          
          <Controller
            name="image"
            control={control}
            rules={{ required: "Profile image is required" }}
            render={({ field }) => (
              <>
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    
                    field.onChange(e.target.files); // Let RHF know the file changed
                    setSelectedFile(file); 

                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setPreviewImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                  style={{ marginBottom: "16px" }}
                />

                {/* Display error message if image validation fails */}
                {errors.image && (
                  <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                    {errors.image.message}
                  </Typography>
                )}
              </>
            )}
          />

          {previewImage && (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src={previewImage}
                alt="Profile Preview"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "1px solid #ccc",
                }}
              />
            </Box>
          )}

          {/* Show selected file name if any*/}
          {selectedFile && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              Selected file: <strong>{selectedFile.name}</strong>
            </Typography>
          )}

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Register
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterForm;
