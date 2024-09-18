import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Delete as DeleteIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import DoneIcon from "@mui/icons-material/Done";
import tradeTheme from "../Theme/tradeTheme";
import axios from "axios";
import { ThemeProvider } from "@emotion/react";
import Cookies from "js-cookie";
import { MiniCard } from "./Custom/Card";
import TradeRequestModal from "./Custom/TradeRequestModal";
import ConfirmationModal from "./Custom/ConfirmationModal";
import MarvelCoinIcon from "../images/Coin.ico";
import ErrorModal from "./Custom/ErrorModal";

const TradePage = ( { setUserParentInfo }) => {
  const [error, setError] = useState(null); // State for managing error messages
  const [isModalOpen, setIsModalOpen] = useState(false); // State for controlling the modal
  const [trades, setTrades] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [showAccepted, setShowAccepted] = useState(false); // State to toggle accepted requests
  const [userDuplicates, setUserDuplicates] = useState([]);
  const [filters, setFilters] = useState({ cardName: "" , accepted: false});
  const [openNM, openNewRequestModal] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null); // State to track selected trade for actions
  const [confirmationOpen, setConfirmationOpen] = useState(false); // Modal state for delete
  const [acceptOpen, setAcceptOpen] = useState(false); // Modal state for accepting trade

  const token = Cookies.get("token");
  const userId = JSON.parse(sessionStorage.getItem("userInfo"))._id;
  let currentc=JSON.parse(sessionStorage.getItem("userInfo")).credits;

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };
  const fetchData = async (url) => {
    try {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const allRequests = await fetchData(
        `${process.env.REACT_APP_API_DOMAIN}/api/request/all`
      );
      const userRequests = allRequests.filter(
        (request) => request.ownerRequest._id === userId
      );
      setTrades(allRequests.filter((request) => request.ownerRequest._id !== userId));
      setMyRequests(userRequests);
      const cardDuplicates = await fetchData(
        `${process.env.REACT_APP_API_DOMAIN}/api/card/copy`
      );
      setUserDuplicates(cardDuplicates.filter((card) => card.count > 1));
    };

    loadData();
  }, []);

  const applyFilters = (tradesList) =>
    tradesList.filter((trade) =>
      // Filter by cardName if provided
      (filters.cardName
        ? trade.requestedCards.some((card) =>
            card.Name.toLowerCase().includes(filters.cardName.toLowerCase())
          )
        : true) &&
      // Filter by accepted status if provided
      (typeof filters.accepted === "boolean"
        ? filters.accepted
          ? true // Show all trades if filters.accepted is true
          : !trade.accepted // Exclude accepted trades if filters.accepted is false
        : true) // No filter if filters.accepted is not provided
    );
  const filteredTrades = applyFilters(trades);
  const filteredMyRequests = applyFilters(myRequests);

  const handleDeleteClick = (trade) => {
    setSelectedTrade(trade);
    setConfirmationOpen(true);
  };

  const handleCloseConfirmation = () => {
    setSelectedTrade(null);
    setConfirmationOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (selectedTrade) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_API_DOMAIN}/api/request/delete/${selectedTrade._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setMyRequests((prevRequests) =>
          prevRequests.filter((request) => request._id !== selectedTrade._id)
        );
        setConfirmationOpen(false);
      } catch (error) {
        console.error(`Error deleting request:`, error);
      }
    }
  };

  const handleAcceptClick = (trade) => {
    setSelectedTrade(trade);
    setAcceptOpen(true);
  };

  const handleCloseAccept = () => {
    setSelectedTrade(null);
    setAcceptOpen(false);
  };

  const handleConfirmAccept = async () => {
    if (selectedTrade) {
      try {
        await axios.post(
          `${process.env.REACT_APP_API_DOMAIN}/api/request/accept/${selectedTrade._id}`,{},
          {
            headers: { Authorization: `Bearer ${token}`},
          }
        );
        currentc=currentc-selectedTrade.price;
        setTrades((prevTrades) =>
          prevTrades.filter((trade) => trade._id !== selectedTrade._id)
        );
        let userinfo=JSON.parse(sessionStorage.getItem("userInfo"));
        userinfo.credits=currentc;
        setUserParentInfo(userinfo);
        sessionStorage.setItem("userInfo", JSON.stringify(userinfo))
        setAcceptOpen(false);
      } catch (error) {
        console.error(`Error accepting trade:`, error);
      }
    }
  };

  const toggleNewRequestModal = (toggle) => {
    openNewRequestModal(toggle);
  };

  const handleSubmitNewRequest = async (newRequest) => {
    const data = JSON.stringify(newRequest);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_DOMAIN}/api/request/add`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setMyRequests((prevRequests) => [...prevRequests, response.data]);
      
      toggleNewRequestModal(false);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred during registration');
      setIsModalOpen(true);
      console.error("Error creating new request:", error);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleShowAcceptedToggle = () => {
    setShowAccepted((prev) => !prev);
    handleFilterChange({ target: { name: "accepted", value: !showAccepted } });
  };

  const userHasCard = (cards) => {
    return cards.every((card) =>
      userDuplicates.some((duplicate) => duplicate.card._id === card._id)
    );
  };

  const SectionTitle = ({ title }) => (
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
      {title}
    </Typography>
  );

  const TradeTable = ({ rows, isUserRequest }) => (
    <Box mb={6}>
      {rows.map((row) => (
        <Paper
          key={row._id}
          elevation={2}
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            opacity: row.accepted   ? 0.3 : 1, // Make accepted requests semi-transparent
            pointerEvents: row.accepted   ? "none" : "auto", // Disable interaction for accepted requests
            cursor: row.accepted  ? "not-allowed" : "default", // Add "not-allowed" cursor for accepted requests
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            width="100%"
            flexGrow={1}
          >
            <Box
              display="flex"
              flexDirection="column"
              overflow="scroll"
              alignItems="center"
              justifyContent="center"
              sx={{
                width: { xs: "100%", sm: "35%", md: "35%" },
                minWidth: "175px",
                maxWidth: 400,
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                Offer
              </Typography>
              <Box
                overflow="auto"
                display="inline-block"
                sx={{
                  width: "fit-content",
                  maxWidth: "100%",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "5px",
                    height: "5px",
                    display: "block",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                  },
                }}
              >
                <Box
                  display="flex"
                  overflow="auto"
                  flexWrap="nowrap"
                  sx={{
                    width: "fit-content",
                    padding: "1rem",
                  }}
                >
                  {row.tradedCards.map((card) => (
                    <MiniCard key={card.cardId._id} card={card.cardId} margin="5px" />
                  ))}
                </Box>
              </Box>
              {row.credits == 0 ? (
                <Box display="flex" alignItems="center" mt={1}></Box>
              ) : (
                <Box display="flex" alignItems="center" mt={1}>
                  <img
                    src={MarvelCoinIcon}
                    alt="Balance Icon"
                    style={{ width: "24px", marginRight: "4px" }}
                  />
                  <Typography variant="body2" fontWeight="bold">
                    {row.credits}
                  </Typography>
                </Box>
              )}
            </Box>
  
            <Box mx={2} display={{ xs: "none", sm: "flex", md: "flex" }} alignItems="center">
              <Typography variant="h6">→</Typography>
            </Box>
  
            <Box
              display="flex"
              flexDirection="column"
              overflow="scroll"
              alignItems="center"
              justifyContent="center"
              sx={{
                width: { xs: "100%", sm: "35%", md: "35%" },
                minWidth: "175px",
                maxWidth: 400,
              }}
            >
              <Typography variant="body1" fontWeight="bold">
                Request
              </Typography>
              <Box
                overflow="auto"
                display="inline-block"
                sx={{
                  width: "fit-content",
                  maxWidth: "100%",
                  overflowY: "auto",
                  "&::-webkit-scrollbar": {
                    width: "5px",
                    height: "5px",
                    display: "block",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#888",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#555",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f1f1f1",
                  },
                }}
              >
                <Box
                  display="flex"
                  overflow="auto"
                  flexWrap="nowrap"
                  sx={{
                    width: "fit-content",
                    padding: "1rem",
                  }}
                >
                  {row.requestedCards.map((card) => (
                    <MiniCard key={card._id} card={card} />
                  ))}
                </Box>
                {row.credits == 0 ? (
                  <Box display="flex" alignItems="center" mt={1}></Box>
                ) : (
                  <Box display="flex" alignItems="center" mt={1} height="24px"></Box>
                )}
              </Box>
            </Box>
          </Box>
  
          <Box ml={2}>
            {isUserRequest ? (
              <IconButton onClick={() => handleDeleteClick(row)} color="error">
                <DeleteIcon />
              </IconButton>
            ) : (
              <IconButton
                color="primary"
                onClick={userHasCard(row.requestedCards) && row.credits<=currentc ? () => handleAcceptClick(row) : null}
                disabled={!userHasCard(row.requestedCards)  ||  row.credits>currentc || row.accepted === true} // Disable button if the request is accepted
              >
                <DoneIcon />
              </IconButton>
            )}
          </Box>
        </Paper>
      ))}
    </Box>
  );

  return (
    <ThemeProvider theme={tradeTheme}>
      <Box padding={4}>
        <Typography
          variant="h4"
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
          Trade Page
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom={4}>
          <TextField
            label="Filter by card request name"
            name="cardName"
            value={filters.cardName}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
            sx={{ "input":{padding: "0px", paddingBottom:"2px"} }}
          />
          <FormControlLabel
            control={<Switch name="accepted" checked={showAccepted} onChange={handleShowAcceptedToggle} />}
            label="Show Accepted Requests"
          />
          <Button variant="contained" color="primary" onClick={() => toggleNewRequestModal(true)}>
            Add New Request
          </Button>
        </Box>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SectionTitle title="My Trade Requests" />
          </AccordionSummary>
          <AccordionDetails>
            <TradeTable rows={filteredMyRequests} isUserRequest />
          </AccordionDetails>
        </Accordion>

        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <SectionTitle title="Available Trades" />
          </AccordionSummary>
          <AccordionDetails>
            <TradeTable rows={filteredTrades} />
          </AccordionDetails>
        </Accordion>

        <TradeRequestModal
          open={openNM}
          onClose={() => toggleNewRequestModal(false)}
          handleSubmitNewRequest={handleSubmitNewRequest}
          token={token}
        />

        <ConfirmationModal
          open={confirmationOpen}
          onClose={handleCloseConfirmation}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message="Are you sure you want to delete this trade request?"
        />

        <ConfirmationModal
          open={acceptOpen}
          onClose={handleCloseAccept}
          onConfirm={handleConfirmAccept}
          title="Accept Trade"
          message="Are you sure you want to accept this trade?"
          confirmText="Accept"
        />
      </Box>
      <ErrorModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        title="Error creating trade request"
        message={error}
      />
    </ThemeProvider>
  );
};

export default TradePage;
