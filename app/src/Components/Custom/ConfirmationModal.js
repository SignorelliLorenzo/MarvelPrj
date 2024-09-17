import React from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography
} from '@mui/material';

const ConfirmationModal = ({
  open,               // Controls whether the modal is open
  onClose,            // Function to close the modal
  onConfirm,          // Function to confirm the action
  title,              // Title of the confirmation dialog
  message,            // Message or content inside the dialog
  confirmText = "Confirm", // Default text for the confirm button
  cancelText = "Cancel",   // Default text for the cancel button
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {cancelText}
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
