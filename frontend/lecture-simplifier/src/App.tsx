// src/App.tsx

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
        default: darkMode ? '#1e1e1e' : '#fafafa',
        paper: darkMode ? '#2a2a2a' : '#fff',
      },
    },
    typography: {
      fontFamily: 'Helvetica, Arial, sans-serif',
    },
  });

  const handleToggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ p: 2, minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Tooltip title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            <IconButton onClick={handleToggleDarkMode} color="inherit">
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Box>

        <TextProcessor />

        <Box sx={{ mt: 4 }}>
          <Box sx={{ textAlign: 'center', opacity: 0.6 }}>
            <small>Built with React + FastAPI + GPT</small>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
