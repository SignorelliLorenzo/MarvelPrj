// albumTheme.js
import { createTheme } from '@mui/material/styles';

const albumTheme = createTheme({
  palette: {
    primary: {
      main: '#ed1d24', // Marvel red
    },
    secondary: {
      main: '#202020', // Dark grey background
    },
  },
  typography: {
    h6: {
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
          backgroundColor: '#2c2c2c',
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
