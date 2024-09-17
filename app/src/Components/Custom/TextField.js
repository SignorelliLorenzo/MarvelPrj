// CustomTextField.js
import React from 'react';
import { TextField } from '@mui/material';

const CTextField = ({
  name,
  label,
  type,
  error,
  helperText,
  ...props
}) => {
  return (
    <TextField
      name={name}
      label={label}
      type={type}
      error={error}
      helperText={helperText}
      fullWidth
      variant="outlined"
      sx={{
        backgroundColor: '#333',
        borderRadius: 4,
        '& .MuiFormLabel-root': { color: '#e0e0e0' },
        '& .MuiInputBase-input': { color: '#fff' },
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#666' },
        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
        'input:-webkit-autofill': {
            boxShadow: '0 0 0 100px #333 inset',
            WebkitTextFillColor: "white !important"
        },
      }}
      {...props}
    />
  );
};

export default CTextField;