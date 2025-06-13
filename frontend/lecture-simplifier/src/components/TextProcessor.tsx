// src/components/TextProcessor.tsx

import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
} from '@mui/material';

const TextProcessor: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState('simplify');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'lecture_output.txt';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5, p: 2 }}>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          p: 2,
          borderRadius: 2,
          textAlign: 'center',
          mb: 3,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          LectureSimplifier
        </Typography>
        <Typography variant="subtitle1">
          Simplify and summarize academic text in seconds.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
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
            sx={{ mb: 2 }}
          />

          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
            Upload Text File
            <input
              type="file"
              accept=".txt"
              hidden
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
          </Button>

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

          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
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
            <Box sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, mb: 2 }}>
              {result.split('\n').map((line, index) => {
                const match = line.match(/^([^:]+):\s*(.*)$/); // matches "Term: definition"
                if (match) {
                  return (
                    <Typography
                      key={index}
                      variant="body1"
                      align="left"
                      sx={{ lineHeight: 1.7 }}
                      color="primary"
                    >
                      <strong>{match[1]}:</strong> {match[2]}
                    </Typography>
                  );
                } else {
                  return (
                    <Typography
                      key={index}
                      variant="body1"
                      align="left"
                      sx={{ lineHeight: 1.7 }}
                      color="primary"
                    >
                      {line}
                    </Typography>
                  );
                }
              })}
            </Box>
            <Button variant="outlined" onClick={handleDownload} fullWidth>
              Download Result as .txt
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default TextProcessor;
