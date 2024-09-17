import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, ListItem, ListItemAvatar, ListItemText, Avatar
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios';

const TradeRequestModal = ({
  open,                   // Controls whether the modal is open
  onClose,                // Function to close the modal
  handleSubmitNewRequest, // Function to handle the submission of the new trade request
  token                   // Auth token to make API requests
}) => {
  const [newRequest, setNewRequest] = useState({
    requestedCard: [],  // Stores the ID of the requested card
    offeredCards: [],   // Stores the IDs of offered cards
    credit: 0,
  });

  const [cardOptions, setCardOptions] = useState([]);
  const [duplicateCards, setDuplicateCards] = useState([]);
  const [loadingRequestedCards, setLoadingRequestedCards] = useState(false);
  const [currentSelected, setCurrentSelected] = useState(null);
  const [formError, setFormError] = useState({
    requestedCard: false,
    offeredCards: false,
    credit: false,
  });

  // Fetch user's duplicate cards from the API (count > 1)
  const fetchDuplicateCards = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/card/copy`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filteredDuplicates = response.data.filter(card => card.count > 1).map(card => card.card);
      setDuplicateCards(filteredDuplicates);
    } catch (error) {
      console.error('Error fetching duplicate cards:', error);
    }
  };

  useEffect(() => {
    fetchDuplicateCards();
    handleCardSearch('');
  }, []);

  // Function to handle typing in the "Requested Card" field and fetch card suggestions
  const handleCardSearch = async (query) => {
    setLoadingRequestedCards(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_DOMAIN}/api/card/all`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          limit: 10,          // Always limit results to 10
          cardName: query,    // Pass the cardName as the query param
        },
      });
      setCardOptions(response.data);
    } catch (error) {
      console.error('Error fetching card suggestions:', error);
    } finally {
      setLoadingRequestedCards(false);
    }
  };

  // Function to handle form validation and submission
  const handleSubmit = () => {
    const error = {
      requestedCard: newRequest.requestedCard.length === 0,  // Check if the array is empty
      offeredCards: newRequest.offeredCards.length === 0,
      credits: newRequest.credits < 0,
    };

    setFormError(error);

    if (!error.requestedCard && !error.offeredCards && !error.credit) {
      console.log(newRequest);
      handleSubmitNewRequest(newRequest);
      setNewRequest({ requestedCard: [], offeredCards: [], credit: 0 }); // Reset the form
      onClose(); // Close the modal
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add New Trade Request</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal" error={formError.requestedCard}>
          <Autocomplete
            value={currentSelected || null}  
            onInputChange={(event, value) => handleCardSearch(value)}
            onChange={(event, newValue) => {
              setNewRequest(prev => ({ ...prev, requestedCard: newValue ? [newValue._id] : [] }))
            setCurrentSelected(newValue)}
          }
           
            options={cardOptions}
            getOptionLabel={(option) => option.Name || ""}
            loading={loadingRequestedCards}
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
                label="Requested Card"
                variant="outlined"
                error={formError.requestedCard}
                helperText={formError.requestedCard ? "Please select a card." : ""}
              />
            )}
          />
        </FormControl>

        {/* Offered Cards (Autocomplete with multiple selection) */}
        <FormControl fullWidth margin="normal" error={formError.offeredCards}>
          <Autocomplete
            multiple
            value={duplicateCards.filter(card => newRequest.offeredCards.includes(card._id)) || []}  
            onChange={(event, newValue) => setNewRequest(prev => ({ ...prev, offeredCards: newValue.map(card => card._id) }))} 
            options={duplicateCards}
            getOptionLabel={(option) => option.Name || ""}
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
                label="Offered Cards (Duplicates Only)"
                variant="outlined"
                error={formError.offeredCards}
                helperText={formError.offeredCards ? "Please offer at least one card." : ""}
              />
            )}
          />
        </FormControl>

        {/* Credit Field */}
        <TextField
          label="Credit"
          name="credit"
          value={newRequest.credits}
          onChange={(e) => setNewRequest(prev => ({ ...prev, credits: parseInt(e.target.value) }))} 
          variant="outlined"
          fullWidth
          margin="normal"
          type="number"
          error={formError.credits}
          helperText={formError.credits ? "Credit cannot be negative." : ""}
        />
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

export default TradeRequestModal;
