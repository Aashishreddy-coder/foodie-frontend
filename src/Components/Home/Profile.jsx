import {useState, useEffect} from "react";
import axiosInstance from "../../utils/axios";
import { Box, Typography } from "@mui/material";

const Profile = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/api/users/getuser");
        console.log(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  if (!user) {
    return (
      <Box>
        <Typography variant="h6">Failed to load user profile !</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6">User Profile</Typography>
      <Box>
        <Typography variant="body1">Name: {user.name}</Typography>
        <Typography variant="body1">Email: {user.email}</Typography>
        <Typography variant="body1">Password: {user.password}</Typography>
        <Typography variant="body1">Phone: {user.phone}</Typography>
        <Typography variant="body1">Address: {user.address}</Typography>
        <img src={`http://localhost:8085/images/${user.image}`} alt="Profile" />
      </Box>
    </Box>
  );
};

export default Profile;
