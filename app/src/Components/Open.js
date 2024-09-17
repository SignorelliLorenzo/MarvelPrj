import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { useTrail, animated } from "@react-spring/web";
import { CardC } from "./Custom/Card"; // Import the CardC component
import { ThemeProvider } from "@mui/material/styles";
import albumTheme from "../Theme/AlbumTheme";
import backCardImage from "../images/cardcover.png"; // Assuming you have this image for the back of the card

const PacketOpening = () => {
  const { packetId } = useParams();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]); // Track which cards are flipped
  const [isOpening, setIsOpening] = useState(true);
  const [allFlipped, setAllFlipped] = useState(false); // Track if all cards are flipped
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const hasOpenedPacket = useRef(false); // Track whether the packet has already been opened

  useEffect(() => {
    if (!hasOpenedPacket.current) {
      openPacket();
      hasOpenedPacket.current = true; // Set ref to true after first call
    }
  }, []);

  const openPacket = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_DOMAIN}/api/packet/open/${packetId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setTimeout(() => {
          setCards(response.data.cards);
          setFlipped(new Array(response.data.cards.length).fill(false)); // Initialize flipped state
          setIsOpening(false);
        }, 3000); // Simulate packet opening delay
      } else {
        console.error("Failed to open packet");
      }
    } catch (error) {
      console.error("Error opening packet:", error);
    }
  };

  // Trail animation for distributing cards from the left
  const trail = useTrail(cards.length, {
    from: { opacity: 0, transform: "translateX(-100%)" },
    to: { opacity: 1, transform: "translateX(0)" },
    config: { tension: 220, friction: 20 },
    delay: 1000, // Delay the animation for a dramatic effect
  });

  // Flip animation for a single card
  const flipCard = (index) => {
    if (!flipped[index]) {
      const newFlipped = [...flipped];
      newFlipped[index] = true;
      setFlipped(newFlipped);
      // Check if all cards have been flipped
      if (newFlipped.every((flip) => flip)) {
        setAllFlipped(true);
      }
    }
  };

  // Card flip style logic
  const cardFlipStyle = (isFlipped) => ({
    transform: isFlipped ? "rotateY(0deg)" : "rotateY(180deg)",
    cursor: isFlipped ? "default" : "pointer",
    transition: "transform 0.6s",
    transformStyle: "preserve-3d",
  });

  if (isOpening) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Opening Packet...
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
          }}
        >
          <div>Opening Animation...</div> {/* Placeholder for animation */}
        </Box>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={albumTheme}>
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Cards Found!
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {trail.map((props, index) => (
            <Grid
              item
              xs={6}
              sm={4}
              md={2}
              lg={12/cards.length}
              key={cards[index].id}
              onClick={() => flipCard(index)} // Flip the card when clicked
              sx={{ display: "flex", justifyContent: "center" , maxHeight:"400px"}} // Center the cards
            >
              <animated.div style={props}>
                <Box
                  sx={{
                    perspective: "1000px", // Enables the 3D flip effect
                    width: { xs: "40vw", sm: "20vw", md: "11vw" }, // Adjust card width
                    height: { xs: "60vw", sm: "30vw", md: "17vw" }, // Adjust card height
                    marginBottom: "1rem",
                    marginTop: "1rem",
                    position: "relative",
                  }}
                >
                  <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${backCardImage})`, // Back card image
                        backgroundSize: "contain",
                        ...cardFlipStyle(!flipped[index]),
                        borderRadius: "12px", // Slight rounded edges
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)", // Shadow for depth
                      }}
                    />
                    {/* Back of the card (shows when flipped) */}
                    <Box
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        backfaceVisibility: "hidden", 
                        ...cardFlipStyle(flipped[index]), // Apply flip styles
                        borderRadius: "12px",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <CardC
                        card={cards[index]}
                        copies={1}
                        handleCardClick={() => {}}
                        margin="0"
                      />
                    </Box>
                  </Box>
                </Box>
              </animated.div>
            </Grid>
          ))}
        </Grid>

        {allFlipped && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/inventory")}
            >
              Back to Inventory
            </Button>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
};

// Helper function to calculate grid size based on the number of cards
const getGridSize = (numCards) => {
  if (numCards === 1) return 12; // Full width
  if (numCards === 2) return 6; // Two columns
  if (numCards === 3) return 4; // Three columns
  if (numCards === 4) return 3; // Four columns
  if (numCards >= 5) return 2; // Five or more cards, smaller size
  return 12; // Default fallback
};

export default PacketOpening;
