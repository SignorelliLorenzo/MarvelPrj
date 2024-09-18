import React, { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { styled } from "@mui/system";
import {
  Grid,
  Pagination,
  Dialog,
  DialogContent,
  Typography,
  Skeleton,
  Box,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import albumTheme from "../Theme/AlbumTheme";
import axios from "axios";
import Cookies from "js-cookie";
import { CardC } from "../Components/Custom/Card";

export const GridBreak = styled("div")({
  width: "100%",
});

const Album = () => {
  const [page, setPage] = useState(1);
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]); // Add state for filtered cards
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Add state for the search query

  const cardsPerPage = 6;
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_DOMAIN}/api/card/copy`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.info("Cards data fetched successfully");
        setCards(response.data);
        setFilteredCards(response.data); // Initialize filteredCards with all cards
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cards data", error);
        setLoading(false);
      }
    };

    fetchCards();
  }, [token]);

  const handleCardClick = async (card) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_DOMAIN}/api/card/${card._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.info(response.data);
      setSelectedCard(response.data);
    } catch (error) {
      console.error("Error fetching card details", error);
    }
  };

  const handleClose = () => {
    setSelectedCard(null);
  };

  // Handle the search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    // Filter cards based on the search query
    const filtered = cards.filter((card) =>
      card.card.Name.toLowerCase().includes(query)
    );
    setFilteredCards(filtered);
    setPage(1); // Reset to the first page on search
  };

  // Paginate the filtered cards
  const paginatedCards = filteredCards.slice(
    (page - 1) * cardsPerPage,
    page * cardsPerPage
  );
  const emptySlots = cardsPerPage - paginatedCards.length;

  return (
    <ThemeProvider theme={albumTheme}>
      {/* Search Bar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2rem",
          marginBottom: "1rem",
        }}
      >
        <TextField
          label="Filter by card"
          name="cardName"
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          sx={{
            input: { backgroundColor: "#3a3a3a", borderRadius: "4px" },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#ccc", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "#888", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#fff", // Border color on focus
              },
              "&.Mui-focused .MuiInputBase-input": {
                color: "#fff", // Text color becomes white on focus
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#fff", // Label color becomes white when focused
            },
          }}
        />
      </Box>
      <Grid
        container
        sx={{
          maxWidth: "900px",
          margin: "0 auto",
          marginTop: "2rem",
          justifyContent: "center",
        }}
      >
        {loading ? (
          Array.from(new Array(cardsPerPage)).map((_, index) => (
            <Grid
              item
              key={index}
              xs={6}
              sm={4}
              sx={{ flex: "1 1 500px", aspectRatio: "2.5/4" }}
            >
              <Skeleton
                variant="rectangular"
                width="100%"
                height="100%"
                animation={false}
              />
            </Grid>
          ))
        ) : (
          <>
            {paginatedCards.map((card) => (
              <Grid
                item
                xs={6}
                sm={4}
                key={card.card._id}
                sx={{
                  flex: "1 1 500px",
                  aspectRatio: "2.5/4",
                  padding: "12px",
                }}
              >
                <CardC
                  card={card.card}
                  copies={card.count}
                  handleCardClick={handleCardClick}
                />
              </Grid>
            ))}

            {Array.from(new Array(emptySlots)).map((_, index) => (
              <Grid
                item
                xs={6}
                sm={4}
                key={`placeholder-${index}`}
                sx={{
                  flex: "1 1 500px",
                  aspectRatio: "2.5/4",
                  padding: "12px",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height="100%"
                  animation={false}
                />
              </Grid>
            ))}
          </>
        )}
      </Grid>
      <Pagination
        count={Math.ceil(cards.length / cardsPerPage)}
        page={page}
        onChange={(event, value) => setPage(value)}
        sx={{ marginTop: "2rem", justifyContent: "center", display: "flex" }}
      />

      {selectedCard && (
        <Dialog
          open={true}
          onClose={handleClose}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#1e2766",
              padding: "8px",
              maxWidth: "800px",
              width: "100%",
            },
          }}
        >
          <DialogContent sx={{ flexGrow: 1 }}>
            <Grid container spacing={0} sx={{ height: "530px" }}>
              <Grid
                item
                xs={5}
                sx={{
                  height: "100%",
                  padding: "10px",
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "52vh",
                    marginBottom: "1rem",
                    marginTop: "1rem",
                  }}
                >
                  <CardC
                    card={selectedCard}
                    copies={1}
                    handleCardClick={() => {}}
                  />
                </Box>
              </Grid>
              <Grid
                item
                xs={7}
                sx={{
                  textAlign: "left",
                  height: "100%",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "left",
                  overflow: "scroll",
                  "& ::-webkit-scrollbar": {
                    display: "none",
                  },
                }}
              >
                <Box>
                  {/* Comics Section */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "Bebas Neue, sans-serif",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      borderBottom: "2px solid white",
                      display: "inline-block",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    Comics
                  </Typography>
                  <List sx={{ color: "#ffffff" }}>
                    {selectedCard.Details.comics.names.length === 0 ? (
                      <ListItem sx={{ paddingY: "0.2rem" }}>
                        <ListItemText primary={<strong>- Unknown</strong>} />
                      </ListItem>
                    ) : (
                      selectedCard.Details.comics.names.map((comic, index) => (
                        <ListItem key={index} sx={{ paddingY: "0.2rem" }}>
                          <ListItemText primary={<strong>- {comic}</strong>} />
                        </ListItem>
                      ))
                    )}
                  </List>

                  {/* Events Section */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "Bebas Neue, sans-serif",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      borderBottom: "2px solid white",
                      display: "inline-block",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    Events
                  </Typography>
                  <List sx={{ color: "#ffffff" }}>
                    {selectedCard.Details.events.names.length === 0 ? (
                      <ListItem sx={{ paddingY: "0.2rem" }}>
                        <ListItemText primary={<strong>- Unknown</strong>} />
                      </ListItem>
                    ) : (
                      selectedCard.Details.events.names.map((event, index) => (
                        <ListItem key={index} sx={{ paddingY: "0.2rem" }}>
                          <ListItemText primary={<strong>- {event}</strong>} />
                        </ListItem>
                      ))
                    )}
                  </List>

                  {/* Series Section */}
                  <Typography
                    variant="h6"
                    sx={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "Bebas Neue, sans-serif",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      borderBottom: "2px solid white",
                      display: "inline-block",
                      paddingBottom: "0.5rem",
                    }}
                  >
                    Series
                  </Typography>
                  <List sx={{ color: "#ffffff" }}>
                    {selectedCard.Details.series.names.length === 0 ? (
                      <ListItem sx={{ paddingY: "0.2rem" }}>
                        <ListItemText primary={<strong>- Unknown</strong>} />
                      </ListItem>
                    ) : (
                      selectedCard.Details.series.names.map((series, index) => (
                        <ListItem key={index} sx={{ paddingY: "0.2rem" }}>
                          <ListItemText primary={<strong>- {series}</strong>} />
                        </ListItem>
                      ))
                    )}
                  </List>

                  {/* Conditionally render the "Trade" button */}
                  {selectedCard.copies >= 2 && (
                    <Box sx={{ marginTop: "16px", textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          backgroundColor: "#ffcc00",
                          color: "#1e2766",
                          "&:hover": {
                            backgroundColor: "#e6b800",
                          },
                        }}
                        onClick={() => handleTrade(selectedCard)}
                      >
                        Trade
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      )}
    </ThemeProvider>
  );
};

export default Album;
