import { createTheme } from '@mui/material/styles';
import { plusJakarta } from './fonts'
export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6C5CE7' },           
    secondary: { main: '#00CEC9' },        
    background: {
      default: '#101018',                   
      paper: '#1A1A23',                     
    },
    text: {
      primary: '#F5F5FA',                  
      secondary: '#B5B5C3',                 
    },
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: plusJakarta.style.fontFamily,
    h1: { fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.5px' },
    button: { fontWeight: 600, letterSpacing: '0.3px' },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '6px 18px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1A1A23',
          borderRadius: 14,
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        },
      },
    },
  },
});
