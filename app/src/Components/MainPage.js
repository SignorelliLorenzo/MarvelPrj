import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Avatar,
  Grid,
} from "@mui/material";
import Album from "./Album";
import Shop from "./Shop";
import Profile from "./Profile";
import Inventory from "./Inventory";
import Open from "./Open";
import Logo from "../images/logo.png";
import Scambi from "./Trade";
import axios from "axios";
import Cookies from "js-cookie";
import MarvelCoinIcon from "../images/Coin.ico";
import PlaceholderPic from "../images/profile-placeholder.png"; // Placeholder image

const MainPage = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isFetching, setIsFetching] = useState(true); // Add a fetching state
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = sessionStorage.getItem("userInfo");
    const token = Cookies.get("token");
    
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
      setIsFetching(false); // Data is already available
    } else if (token) {
      fetchUserInfo();
    } else {
      setIsFetching(false); // No token and no data, stop fetching
    }
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = (
        await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/profile/`, {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        })
      ).data;
      const data = response.data;

      if (response.success) {
        setUserInfo(data);
        sessionStorage.setItem("userInfo", JSON.stringify(data)); // Store in session storage
      } else {
        console.error("Failed to fetch user info: " + response.statusText);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setIsFetching(false); // Fetching completed
    }
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
    setUserMenuOpen(true);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    sessionStorage.removeItem("userInfo");
    setUserInfo(null); // Clear user info on logout
    navigate("/login"); // Redirect to login or appropriate route
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleBalanceClick = () => {
    navigate("/shop");
  };

  if (isFetching) {
    return <div>Loading...</div>; // Show a loading state while fetching
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <Typography variant="h6" component="div">
                <img src={Logo} alt="Logo" style={{ height: "40px" }} />
              </Typography>
            </Grid>
            <Grid item xs={4} sx={{ textAlign: "center" }}>
              <Button color="inherit" component={Link} to="/my-album">
                My Album
              </Button>
              <Button color="inherit" component={Link} to="/scambi">
                Trade
              </Button>
              <Button color="inherit" component={Link} to="/shop">
                Shop
              </Button>
              <Button color="inherit" component={Link} to="/inventory">
                Inventory
              </Button>
            </Grid>
            <Grid
              item
              xs={4}
              sx={{
                textAlign: "right",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  backgroundColor: "#f4f4f4",
                  borderRadius: "16px",
                  padding: "0.5rem",
                  cursor: "pointer",
                  marginRight: "1rem",
                }}
                onClick={handleBalanceClick}
              >
                <img
                  src={MarvelCoinIcon}
                  alt="Balance Icon"
                  style={{ width: "24px", marginRight: "4px" }}
                />
                <Typography variant="body1" sx={{ color: "#000" }}>
                  {userInfo ? userInfo.credits : "..."}
                </Typography>
              </Box>
              <IconButton
                onClick={handleProfileClick}
                sx={{ padding: 0, marginRight: "1rem" }}
              >
                <Avatar
                  alt="User Profile"
                  src={
                    userInfo && userInfo.profileImage
                      ? userInfo.profileImage
                      : PlaceholderPic
                  }
                />
              </IconButton>
              <Button
                color="inherit"
                onClick={handleMenuClick}
                sx={{ display: "flex", alignItems: "center" }}
              >
                Ciao, {userInfo ? userInfo.username : "Nome Utente"}
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={userMenuOpen}
                onClose={handleMenuClose}
                // Add styles using the `sx` prop
                sx={{
                  "& .MuiPaper-root": {
                    bgcolor: "#2a2a2a", // Set the background color of the menu
                    width: 100, // Set the width of the menu
                  },
                }}
              >
                <MenuItem
                  onClick={handleProfileClick}
                  sx={{
                    color: "#fff", // Set text color to white
                    "&:hover": {
                      bgcolor: "#444", // Set hover background color
                    },
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: "#fff", // Set text color to white
                    "&:hover": {
                      bgcolor: "#444", // Set hover background color
                    },
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Container>
        <Routes>
          <Route path="/" element={<Navigate to="/my-album" />} />{" "}
          {/* Default route */}
          <Route path="/my-album" element={<Album />} />
          <Route path="/scambi" element={<Scambi  setUserParentInfo={setUserInfo}/>} />
          <Route
            path="/shop"
            element={<Shop setUserParentInfo={setUserInfo} isAdmin={userInfo.admin} />}
          />
          <Route
            path="/profile"
            element={<Profile setUserParentInfo={setUserInfo} />}
          />{" "}
          {/* Profile route */}
          <Route path="/statics" element={<div>Statics Page</div>} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/open/:packetId" element={<Open />} />
        </Routes>
      </Container>
    </>
  );
};

export default MainPage;
