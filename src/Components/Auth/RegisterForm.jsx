import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
  Collapse,
  Fade,
  Grow,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [pendingErrorMessage, setPendingErrorMessage] = useState("");
  const [pendingSuccessMessage, setPendingSuccessMessage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const alertRef = useRef(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (pendingErrorMessage && alertRef.current) {
      alertRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      const showErrorTimeout = setTimeout(() => {
        setErrorMessage(pendingErrorMessage);
        setPendingErrorMessage("");
      }, 300);

      return () => clearTimeout(showErrorTimeout);
    }
  }, [pendingErrorMessage]);

  useEffect(() => {
    if (pendingSuccessMessage && alertRef.current) {
      alertRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      const showSuccessTimeout = setTimeout(() => {
        setSuccessMessage(pendingSuccessMessage);
        setPendingSuccessMessage("");

        setTimeout(() => {
          navigate("/login");
        }, 2000); // Redirect after 2 seconds
      }, 300);

      return () => clearTimeout(showSuccessTimeout);
    }
  }, [pendingSuccessMessage]);

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

      setPendingSuccessMessage("Registration successful!");
      setErrorMessage("");
      
      reset(); // Clear form
      setPreviewImage(null); // Reset preview image
      setSelectedFile(null); // Reset selected file
    }
    catch (error) {
      console.log("Full error:", error);
      
      const errorMsg = 
        error.response && error.response.data 
          ? error.response.data 
          : "Something went wrong. Please try again.";
      
      setPendingErrorMessage(errorMsg);
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
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
            component="form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Typography variant="h5" component="h1" align="center" color="primary">
              Create Your Account
            </Typography>

            <Typography
              variant="body2"
              align="center"
              color="secondary"
              sx={{ mb: 1 }}
            >
              Sign up to explore fresh food near you 🍱
            </Typography>

            {/* Error and success messages */}
            <Box ref={alertRef} sx={{ mb: 2 }}>
              <Collapse in={!!errorMessage}>
                <Alert severity="error" color="error">
                  {errorMessage}
                </Alert>
              </Collapse>

              <Collapse in={!!successMessage}>
                <Alert severity="success" color="success">
                  {successMessage}
                </Alert>
              </Collapse>
            </Box>

            {/* Name */}
            <TextField
              fullWidth
              label="Name"
              color="primary"
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
            />
            
            {/* Email */}
            <TextField
              fullWidth
              type="email"
              label="Email"
              color="primary"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9](\.?[a-zA-Z0-9_-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/,
                  message: "Invalid email format",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            {/* Password */}
            <TextField
              fullWidth
              type="password"
              label="Password"
              color="primary"
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
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              type="password"
              label="Confirm Password"
              color="primary"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            {/* Phone Number */}
            <TextField
              fullWidth
              type="tel"
              label="Phone"
              color="primary"
              inputProps={{
                inputMode: "numeric", // helps mobile keyboard show numeric keypad
                pattern: "[0-9]*",    // optional: hint to browser
              }}
              {...register("phone", { 
                required: "Phone number is required",
                validate: {
                  isDigits: (value) =>
                    /^[0-9]+$/.test(value) || "Only digits are allowed",
                  isTenDigits: (value) =>
                    value.length === 10 || "Phone number must be exactly 10 digits",
                  doesNotStartWithZero: (value) =>
                    !/^0/.test(value) || "Phone number cannot start with 0",
                },
              })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            {/* Address */}
            <TextField
              fullWidth
              label="Address"
              color="primary"
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
            />

            {/* Profile Image */}
            <Typography variant="body2" color="text.secondary">
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
                    data-testid="image-upload"
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
                    <Typography variant="body2" color="error" >
                      {errors.image.message}
                    </Typography>
                  )}
                </>
              )}
            />

            <Fade in={!!previewImage} timeout={500}>
                <Box
                  sx={{
                    mb: 2,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {previewImage && (
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
                  )}
                </Box>
              </Fade>

            {/* Show selected file name if any*/}
            {selectedFile && (
              <Typography variant="body2" color="text.secondary">
                Selected file: <strong>{selectedFile.name}</strong>
              </Typography>
            )}

            {/* Submit */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Register
            </Button>

            <Typography variant="body2" align="center" sx={{ mt: 2 }}>
              Already have an account?{" "}
              <Button
                variant="text"
                size="small"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Login
              </Button>
            </Typography>
          </Paper>
        </Grow>
      </Container>
    </Box>
  );
};

export default RegisterForm;
