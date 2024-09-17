import { createTheme } from '@mui/material/styles';

const tradeTheme = createTheme({
  palette: {
    primary: {
      main: '#ed1d24', // Marvel red
    },
    secondary: {
      main: '#202020', // Dark grey background
    },
    background: {
      default: '#1e1e1e', // Slightly darker background for the trade page
      paper: '#2a2a2a', // Darker paper color for modals and tables
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#b0b0b0', // Light grey for secondary text
    },
  },
  typography: {
    h6: {
      color: '#ffffff',
    },
    body1: {
      color: '#ffffff',
    },
    button: {
      textTransform: 'none', // Disable uppercase transformation on buttons
    },
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#2a2a2a', // Table background color
          color: '#ffffff', // Table text color
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #444444', // Border color between rows
          padding: '12px 16px', // Adjusting padding
        },
        head: {
          backgroundColor: '#333333', // Background for table headers
          color: '#ffffff', // Text color for headers
          fontWeight: 'bold',
        },
        body: {
          color: '#b0b0b0', // Text color for body cells
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#242424', // Alternate row color
          },
          '&:hover': {
            backgroundColor: '#3a3a3a', // Hover effect for rows
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: '#ed1d24', // Red Marvel button color
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#d0171f', // Darker red on hover
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2c2c2c',
          color: '#ffffff',
          padding: '24px',
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          color: '#ffffff',
          backgroundColor: '#3a3a3a',
          padding: '8px 12px',
          borderRadius: '4px',
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#ffffff',
        },
      },
    },
  },
});

export default tradeTheme;
