import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Avatar,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Card,
  TextField,
  Paper,
  ListItem, ListItemAvatar, ListItemText,
} from "@mui/material";
import Cookies from "js-cookie";
import PlaceholderPic from "../images/profile-placeholder.png";
import CustomTextField from "./Custom/TextField"; // Import your custom TextField component
import EditIcon from "@mui/icons-material/Edit"; // Import the pencil icon
import Autocomplete from '@mui/material/Autocomplete';
import axios from "axios";

const Profile = ({ setUserParentInfo }) => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
    credits: 0,
    profileImage: "",
  });
  const [cardOptions, setCardOptions] = useState([]);
  const [currentSelected, setCurrentSelected] = useState(null);
  const [newUsername, setNewUsername] = useState("");
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingRequestedCards, setLoadingRequestedCards] = useState(false);
  const token = Cookies.get("token");
  useEffect(() => {
    handleCardSearch("");
    fetchUserInfo();
  }, []);
  function handleMouseOver() {
    document.getElementById("edit-button").style.display = "flex";
  }

  function handleMouseOut() {
    document.getElementById("edit-button").style.display = "none";
  }
  const fetchUserInfo = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_DOMAIN}/api/profile/`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      const data = (await response.json()).data;

      if (response.ok) {
        setUserInfo(data);
        setNewUsername(data.username);
        setCurrentSelected(data.favHero);
        setIsLoading(false);
      } else {
        setError("Failed to fetch user info");
      }
    } catch (error) {
      setError("Error fetching user info");
    }
  };

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProfileImage(reader.result); // Base64 string of the image
      };
      reader.readAsDataURL(file); // Convert the image to Base64
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleSave = async () => {
    const formData = new FormData();
    if (newUsername) {
      formData.append("username", newUsername);
    }
    if (newProfileImage) {
      formData.append("profileImage", newProfileImage);
    }
    if (newPassword) {
      formData.append("password", newPassword);
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    if(currentSelected) {
      formData.append("favHero", currentSelected._id);
    }
    var object = {};
    formData.forEach((value, key) => (object[key] = value));
    var json = JSON.stringify(object);
    try {
      const response = (
        await axios.put(
          `${process.env.REACT_APP_API_DOMAIN}/api/profile/`,
          json,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
              "Content-type": "application/json",
            },
          }
        )
      ).data;
      if (response.success) {
        const updatedData = response.data;
        setUserInfo(updatedData);
        sessionStorage.setItem("userInfo", JSON.stringify(updatedData));
        setUserParentInfo(updatedData);
        setSuccess("Profile updated successfully!");
      } else {
        setError("Failed to update profile");
      }
    } catch (error) {
      setError("Error updating profile");
    }
  };
  const handleCardSearch = async (query) => {
    setLoadingRequestedCards(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_DOMAIN}/api/card/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            limit: 10, // Always limit results to 10
            cardName: query, // Pass the cardName as the query param
          },
        }
      );
      setCardOptions(response.data);
    } catch (error) {
      console.error("Error fetching card suggestions:", error);
    } finally {
      setLoadingRequestedCards(false);
    }
  };
  return (
    <Container maxWidth="sm">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          textAlign: "center",
          mt: 4,
          color: "white",
          width: "100%",
          fontFamily: "Bebas Neue, sans-serif",
          letterSpacing: "1px",
          textTransform: "uppercase",
          borderBottom: "2px solid white",
          display: "inline-block",
          paddingBottom: "0.5rem",
        }}
      >
        Manage Profile
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Card
          sx={{
            backgroundColor: "#2c2c2c",
            color: "#fff",
            padding: "2rem",
            borderRadius: "12px",
            mt: 4,
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}
          <Box mb={2} textAlign="center">
            <Box
              sx={{ position: "relative", display: "inline-block" }}
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
            >
              <Avatar
                alt="Profile Image"
                src={newProfileImage || userInfo.profileImage || PlaceholderPic}
                sx={{
                  width: 120,
                  height: 120,
                  margin: "0 auto",
                  border: "2px solid #2c2c2c",
                }}
              />
              <Button
                variant="contained"
                id="edit-button"
                component="label"
                sx={{
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.7)" },
                  display: "none",
                  justifyContent: "center",
                  flexDirection: "column",
                  borderRadius: "50%",
                  padding: "0",
                }}
              >
                <input type="file" hidden onChange={handleImageChange} />
                <EditIcon
                  sx={{
                    width: "50px",
                    height: "50px",
                    margin: "auto auto",
                    color: "#2c2c2c",
                  }}
                />
              </Button>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="gray" gutterBottom>
                Email
              </Typography>
              <Typography variant="body1">{userInfo.email}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" color="gray" gutterBottom>
                Credits
              </Typography>
              <Typography variant="body1">{userInfo.credits}</Typography>
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Username"
                value={newUsername}
                onChange={handleUsernameChange}
                variant="outlined"
                InputLabelProps={{ style: { color: "#fff" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                InputLabelProps={{ style: { color: "#fff" } }}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={handlePasswordChange}
                variant="outlined"
                InputLabelProps={{ style: { color: "#fff" } }}
              />
            </Grid>
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Autocomplete
                value={currentSelected || null}
                onInputChange={(event, value) => handleCardSearch(value)}
                onChange={(event, newValue) => {
                  setCurrentSelected(newValue);
                }}
                options={cardOptions}
                getOptionLabel={(option) => option.Name || ""}
                loading={loadingRequestedCards}
                PaperComponent={({ children }) => (
                  <Paper sx={{ bgcolor: "#2a2a2a" }}> {/* Set the background color to black */}
                    {children}
                  </Paper>
                )}
                renderOption={(props, option) => (
                  <ListItem {...props} key={option.id}>
                    <ListItemAvatar>
                      <Avatar
                        src={option.Img} // Assuming the image URL is in the "Img" property
                        alt={option.Name}
                        sx={{ width: 40, height: 40 }} // Make the avatar round and set size
                      />
                    </ListItemAvatar>
                    <ListItemText primary={option.Name} />
                  </ListItem>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Favorite hero"
                    variant="outlined"
                    sx={{
                      // Set gray box shadow and background styling for the input field
                      bgcolor: '#333', // Background color for the input box
                      borderRadius: 2, // Rounded corners
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: '#666', // Border color
                        },
                        '&:hover fieldset': {
                          borderColor: '#aaa', // Border color on hover
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#fff', // Border color when focused
                        },
                      },
                      '& .MuiInputBase-input': {
                        color: '#fff', // White text for the input
                      },
                      '& .MuiFormLabel-root': {
                        color: '#e0e0e0', // Label color
                      },
                    }}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSave}
                sx={{ mt: 2 }}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </Card>
      )}
    </Container>
  );
};

export default Profile;
