// loginTheme.js
import { createTheme } from '@mui/material/styles';

const loginTheme = createTheme({
  palette: {
    primary: {
      main: '#d32f2f', // button-color
    },
    secondary: {
      main: '#007bff', // register-button-color
    },
    text: {
      primary: '#fff', // text-color
      secondary: '#e0e0e0', // text-color-light
    },
    background: {
      default: '#1e1e1e',
      paper: '#2c2c2c',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#fff',
        },
        containedPrimary: {
          backgroundColor: '#d32f2f',
          '&:hover': {
            backgroundColor: '#b71c1c',
          },
        },
        containedSecondary: {
          backgroundColor: '#007bff',
          '&:hover': {
            backgroundColor: '#0056b3',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#333',
          borderRadius: 4,
          '& .MuiFormLabel-root': {
            color: '#308ff7',
          },
          '& .MuiInputBase-input': {
            color: '#fff',
          },
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#666',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#fff',
          },
        },
      },
    },
  },
});

export default loginTheme;
