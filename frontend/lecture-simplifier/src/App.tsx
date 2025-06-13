import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TextProcessor from './components/TextProcessor';
import { IconButton, Box, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

 const theme = createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    background: {
      default: darkMode ? '#1e1e1e' : '#fafafa', // lighter than pure black
      paper: darkMode ? '#2a2a2a' : '#fff', // also controls Box and Card backgrounds
    },
  },
});


  const handleToggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton onClick={handleToggleDarkMode} color="inherit">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <TextProcessor />
      </Box>
    </ThemeProvider>
  );
};

export default App;
