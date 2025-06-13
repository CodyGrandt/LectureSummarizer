// src/components/TextProcessor.tsx

import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

const TextProcessor: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState('simplify');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const modes = [
    'simplify',
    'summarize',
    'bullet',
    'complexify',
    'question',
    'define',
    'explain_like_im_5',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      const response = await fetch('https://lecturesummarizer.onrender.com/process-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, mode: selectedMode }),
      });

      const data = await response.json();
      setResult(data.output);
    } catch (error) {
      console.error('Fetch error:', error);
      setResult('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        LectureSimplifier
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Enter academic text"
          multiline
          fullWidth
          rows={6}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          variant="outlined"
          margin="normal"
        />

        <Select
          fullWidth
          value={selectedMode}
          onChange={(e) => setSelectedMode(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        >
          {modes.map((mode) => (
            <MenuItem key={mode} value={mode}>
              {mode.charAt(0).toUpperCase() + mode.slice(1).replace(/_/g, ' ')}
            </MenuItem>
          ))}
        </Select>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          fullWidth
        >
          {loading ? 'Processing...' : 'Submit'}
        </Button>
      </form>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {result && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Output:</Typography>
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}
            align="left"
          >
            {result}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TextProcessor;
