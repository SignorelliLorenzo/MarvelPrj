import { createTheme } from '@mui/material/styles';

const albumTheme = createTheme({
  palette: {
    primary: {
      main: '#ed1d24', // Marvel red
    },
    secondary: {
      main: '#1e3a8a', // Darker blue for cards
    },
    background: {
      default: '#2B3784', // Vibrant light blue background
    },
  },
  typography: {
    h6: {
      fontWeight: 500,
      color: '#ffffff',
    },
    body1: {
      color: '#ffffff',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e3a8a', // Darker blue for the cards
          color: '#ffffff',
          borderRadius: '8px',
          overflow: 'hidden',
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          height: 140,
          objectFit: 'cover', // Ensure the image is cropped and zoomed
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px',
        },
      },
    },
  },
});

export default albumTheme;
