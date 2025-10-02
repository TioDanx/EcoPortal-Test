// src/theme.ts
import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#6C5CE7' },        
    secondary: { main: '#9A7DFF' },      
    background: { default: '#0B0B0F', paper: '#540661' },
    text: { primary: '#EDEDF7', secondary: '#B7B7C9' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial'].join(','),
    h1: { fontSize: '1.75rem', fontWeight: 700 }, 
  },
  components: {
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
});
