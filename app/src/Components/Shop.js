import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  IconButton,
  Box,
} from "@mui/material";
import axios from "axios";
import ShopSection from "./Custom/ShopSection";
import Cookies from "js-cookie";
import AddIcon from "@mui/icons-material/Add"; // Icon for adding new package
import DeleteIcon from '@mui/icons-material/Delete';

import AddPacketModal from "./Custom/AddPacketModal"; // Import the AddPacketModal component

// Import images directly
import img1000MarvelPoints from "../images/1000-marvelpoints.png";
import img100MarvelPoints from "../images/100-marvelpoints.png";
import img50MarvelPoints from "../images/50-marvelpoints.png";
import img10MarvelPoints from "../images/10-marvelpoints.png";

const Shop = ({ setUserParentInfo, isAdmin }) => {
  // Pass isAdmin prop to check for admin user
  const token = Cookies.get("token");
  const [credits, setCredits] = useState([]);
  const [packages, setPackages] = useState([]);

  // Modal states
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Admin Modals (Add and Delete)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null); // For delete modal

  useEffect(() => {
    const fetchShopItems = async () => {
      try {
        const credits = [
          {
            id: 1,
            name: "1000 MarvelPoints",
            price: "$99.99",
            img: img1000MarvelPoints,
            num: 1000,
          },
          {
            id: 2,
            name: "100 MarvelPoints",
            price: "$9.99",
            img: img100MarvelPoints,
            num: 100,
          },
          {
            id: 3,
            name: "50 MarvelPoints",
            price: "$4.99",
            img: img50MarvelPoints,
            num: 50,
          },
          {
            id: 4,
            name: "10 MarvelPoints",
            price: "$0.99",
            img: img10MarvelPoints,
            num: 10,
          },
        ];

        const packageResponse = await axios.get(
          `${process.env.REACT_APP_API_DOMAIN}/api/packet/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const packagesWithId = packageResponse.data.map((item) => ({
          ...item,
          id: item._id,
          _id: undefined,
        }));
        setCredits(credits);
        setPackages(packagesWithId);
      } catch (error) {
        console.error("Error fetching shop items:", error);
      }
    };

    fetchShopItems();
  }, [token]);

  const handleBuyCredits = async (id) => {
    const num = credits.find((credit) => credit.id === id).num;
    try {
      const response = (
        await axios.post(
          `${process.env.REACT_APP_API_DOMAIN}/api/profile/credits`,
          JSON.stringify({ credits: num }),
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
          }
        )
      ).data;

      if (response.success) {
        setUserParentInfo(response.data);
        setModalMessage("Purchase successful!"); // Set success message
        setSuccessModalOpen(true); // Open success modal
      } else {
        setModalMessage("Insufficient balance."); // Set insufficient balance message
        setBalanceModalOpen(true); // Open insufficient balance modal
      }
    } catch (error) {
      setModalMessage("Error buying credits: " + error.message); // Set error message
      setErrorModalOpen(true); // Open error modal
    }
  };

  const handleBuyPackage = async (id) => {
    const selectedPackage = packages.find((pkg) => pkg.id === id);
    if (!selectedPackage) {
      console.error("Package not found");
      return;
    }

    const packagePrice = selectedPackage.Price;
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_DOMAIN}/api/packet/buy`,
        JSON.stringify({ packetId: id }),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
          },
        }
      );


      // Update the user's balance in the parent component
      setUserParentInfo((prevUserInfo) => ({
        ...prevUserInfo,
        credits: prevUserInfo.credits - packagePrice, // Deduct the package price from the balance
      }));
    } catch (error) {
      console.error("Error buying package:", error);
    }
  };

  const handleDeletePackage = async (Packet) => {
    
    try {
      axios.delete(
        `${process.env.REACT_APP_API_DOMAIN}/api/packet/delete/${Packet.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPackages(packages.filter((pkg) => pkg.id !== Packet.id))
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };

  const handleCreatePackage = async (newPacket) => {
    try {
      // Convert image to Base64 before sending
      if (newPacket.image) {
        const reader = new FileReader();
        reader.readAsDataURL(newPacket.image);
        
        reader.onloadend = async () => {
          const base64Image = reader.result;
  
          // Create a new object with the Base64 image included
          const packetWithBase64Image = {
            ...newPacket,
            image: base64Image, // Replace the file with the Base64 string
          };
  
          // Send the packet with Base64 image
          const response = await axios.post(
            `${process.env.REACT_APP_API_DOMAIN}/api/packet/add`,
            packetWithBase64Image,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-type": "application/json",
              },
            }
          );
          response.data.id=response.data._id
          setPackages([...packages, response.data]); // Add new package to the list
          setCreateModalOpen(false); // Close modal
        };
      } else {
        // If no image, just send the packet without the image field
        const response = await axios.post(
          `${process.env.REACT_APP_API_DOMAIN}/api/packet/add`,
          newPacket,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-type": "application/json",
            },
          }
        );
        setPackages([...packages, response.data]); // Add new package to the list
        setCreateModalOpen(false); // Close modal
      }
    } catch (error) {
      console.error("Error creating package:", error);
    }
  };

  const handleCloseErrorModal = () => setErrorModalOpen(false);
  const handleCloseSuccessModal = () => setSuccessModalOpen(false);
  const handleCloseBalanceModal = () => setBalanceModalOpen(false);

  return (
    <Container maxWidth="lg" sx={{ marginTop: "2rem" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          color: "white",
          textAlign: "center",
          marginBottom: "2rem",
          fontFamily: "Bebas Neue, sans-serif",
          letterSpacing: "1px",
          textTransform: "uppercase",
          borderBottom: "2px solid white",
          display: "inline-block",
          paddingBottom: "0.5rem",
        }}
      >
        Marvelverse Shop
      </Typography>

      <ShopSection
         header={
            <Typography
              variant="h5"
              sx={{
                marginBottom: "1.5rem",
                color: "white",
                fontFamily: "Bebas Neue, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "1px",
                borderBottom: "2px solid white",
                display: "inline-block",
                paddingBottom: "0.5rem",
              }}
            >
              Buy MarvelPoints
            </Typography>
          }
        items={credits}
        onItemClick={handleBuyCredits}
      />
      <ShopSection
        header={
        <Box>
          <Typography
            variant="h5"
            sx={{
              marginBottom: "1.5rem",
              color: "white",
              fontFamily: "Bebas Neue, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "1px",
              borderBottom: "2px solid white",
              display: "inline-block",
              paddingBottom: "0.5rem",
            }}
          >
            Buy Packet
          </Typography>
           {isAdmin && ( // Only show Add Package button for admins
            <IconButton
              variant="contained"
              sx={{
                width: "2rem",
                height: "2rem",
                marginLeft: "2rem",
                backgroundColor: "#ed1d24",
                color: "#fff",
                fontFamily: "Bebas Neue, sans-serif",
                "&:hover": {
                  backgroundColor: "#c21825",
                },
              }}
              onClick={() => setCreateModalOpen(true)} // Open the AddPacketModal
            >
              <AddIcon />
            </IconButton>
          )}
          </Box>
        }
        items={packages}
        onItemClick={handleBuyPackage}
        badgeButtons={isAdmin ?  ( 
              <DeleteIcon />
           ) : null}
        handleBadgeClick={isAdmin ? handleDeletePackage : null}
        onDelete={setSelectedPackage}
      />

      {/* AddPacketModal component */}
      <AddPacketModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)} // Close the modal
        handleSubmitNewPacket={handleCreatePackage} // Handle create packet
        token={token} // Pass the token for API requests
      />
    </Container>
  );
};

export default Shop;
