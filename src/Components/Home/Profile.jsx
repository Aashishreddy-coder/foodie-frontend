import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../utils/axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Fade,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageUpdatedAt, setImageUpdatedAt] = useState(Date.now());

  const fileInputRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleEditProfile = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axiosInstance.put(
          "/api/users/update/image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setUser({
          ...user,
          image: response.data.image,
        });
        setImageUpdatedAt(Date.now());
        console.log("Image updated:", response.data);
      } catch (error) {
        console.error("Error updating image:", error);
      }
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/users/getuser");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 6,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 6,
        }}
      >
        <Typography variant="h6" color="error">
          Failed to load user profile!
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        mx: { xs: 1, md: "auto" },
        maxWidth: 600,
        mt: 4,
      }}
    >
      <Fade in timeout={800}>
        <Card
          sx={{
            p: 3,
            borderRadius: 4,
            backgroundColor: "background.paper",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={`http://localhost:8085/images/${user.image}?t=${imageUpdatedAt}`}
                alt={user.name}
                sx={{
                  width: 100,
                  height: 100,
                  border: "2px solid",
                  borderColor: "primary.main",
                  mb: 2,
                }}
              />
              <IconButton color="red" onClick={handleEditProfile}>
                <EditIcon />
              </IconButton>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                ref={fileInputRef}
              />

              <Typography
                variant={isMobile ? "h6" : "h5"}
                fontWeight="bold"
                color="primary"
              >
                {user.name}
              </Typography>
              <Box sx={{ width: "100%", mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                  <strong>Email:</strong> {user.email}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Password:</strong> *********
                </Typography>

                <Typography variant="body1" gutterBottom>
                  <strong>Phone:</strong> {user.phone}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Address:</strong> {user.address}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default Profile;
