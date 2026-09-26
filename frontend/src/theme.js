import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F46E5', // Indigo
      hover: '#4338CA',
    },
    secondary: {
      main: '#10B981', // Emerald Green
    },
    error: {
      main: '#EF4444', // Red
      hover: '#DC2626',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Segoe UI", sans-serif',
  },
  shape: {
    borderRadius: 10,
  },
});

export default theme;