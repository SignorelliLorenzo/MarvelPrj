import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";

const AddPacketModal = ({
  open, // Controls whether the modal is open
  onClose, // Function to close the modal
  handleSubmitNewPacket, // Function to handle the submission of the new packet
}) => {
  const [newPacket, setNewPacket] = useState({
    name: "", // Packet name
    price: 0, // Packet price
    numberOfCards: 0, // Number of cards in the packet
    image: null, // Image of the packet
  });

  const [formError, setFormError] = useState({
    name: false,
    price: false,
    numberOfCards: false,
    image: false,
  });

  // Function to handle form validation and submission
  const handleSubmit = () => {
    const error = {
      Name: newPacket.name.trim() === "", // Validate if name is empty
      Price: newPacket.price <= 0, // Price must be a positive number
      numberOfCards: newPacket.numberOfCards <= 0, // Number of cards must be positive
      Img: !newPacket.image, // Check if image is uploaded
    };

    setFormError(error);

    // Only submit if there are no errors
    if (!error.name && !error.price && !error.numberOfCards && !error.image) {
      console.log(newPacket);
      handleSubmitNewPacket(newPacket); // Call the submit handler
      setNewPacket({ name: "", price: 0, numberOfCards: 0, image: null }); // Reset the form
      onClose(); // Close the modal
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setNewPacket((prev) => ({ ...prev, image: file }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { background: "#2a2a2a", color: "white" } }}
    >
      <DialogTitle sx={{ textAlign: "center", fontSize: "1.5rem" }}>
        ADD NEW PACKET
      </DialogTitle>
      <DialogContent>
        {/* Packet Name */}
        <FormControl fullWidth margin="normal" error={formError.name}>
          <TextField
            label="Packet Name"
            variant="outlined"
            value={newPacket.name}
            onChange={(e) =>
              setNewPacket((prev) => ({ ...prev, name: e.target.value }))
            }
            error={formError.name}
            helperText={formError.name ? "Please enter a packet name." : ""}
            InputLabelProps={{
              sx: { color: "white" },
            }}
            sx={{
              input: {
                color: "white",
              },
            }}
          />
        </FormControl>

        {/* Packet Price */}
        <FormControl fullWidth margin="normal" error={formError.price}>
          <TextField
            label="Price"
            variant="outlined"
            type="number"
            value={newPacket.price}
            onChange={(e) =>
              setNewPacket((prev) => ({
                ...prev,
                price: parseInt(e.target.value),
              }))
            }
            error={formError.price}
            helperText={formError.price ? "Price must be a positive number." : ""}
            InputLabelProps={{
              sx: { color: "white" },
            }}
            sx={{
              input: {
                color: "white",
              },
            }}
          />
        </FormControl>

        {/* Number of Cards */}
        <FormControl fullWidth margin="normal" error={formError.numberOfCards}>
          <TextField
            label="Number of Cards"
            variant="outlined"
            type="number"
            value={newPacket.numberOfCards}
            onChange={(e) =>
              setNewPacket((prev) => ({
                ...prev,
                numberOfCards: parseInt(e.target.value),
              }))
            }
            error={formError.numberOfCards}
            helperText={
              formError.numberOfCards
                ? "Number of cards must be positive."
                : ""
            }
            InputLabelProps={{
              sx: { color: "white" },
            }}
            sx={{
              input: {
                color: "white",
              },
            }}
          />
        </FormControl>

        {/* Custom File Upload */}
        <FormControl fullWidth margin="normal" error={formError.image}>
          <Box
            component="label"
            htmlFor="packet-image-upload"
            sx={{
              border: "1px solid #fff",
              padding: "10px",
              borderRadius: "4px",
              cursor: "pointer",
              textAlign: "center",
              backgroundColor: "#333",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#444",
              },
            }}
          >
            {newPacket.image ? (
              <Typography variant="body2">
                {newPacket.image.name}
              </Typography>
            ) : (
              <Typography variant="body2">Choose an image</Typography>
            )}
          </Box>
          <input
            id="packet-image-upload"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
          {formError.image && (
            <Typography color="error" variant="caption">
              Please upload an image.
            </Typography>
          )}
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPacketModal;
