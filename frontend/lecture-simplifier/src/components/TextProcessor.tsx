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
  Snackbar,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';

const TextProcessor: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState('simplify');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

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
    if (!file) return;

    const fileType = file.type;

    if (fileType === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInputText(text);
      };
      reader.readAsText(file);
    } else {
      alert('Unsupported file type. Please upload a .txt file.');
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

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopySuccess(true);
  };

  const handleClear = () => {
    setInputText('');
    setResult('');
  };

  const handleDownloadNotes = () => {
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '');
    const blob = new Blob([notes], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `lecture_notes_${timestamp}.txt`;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show "Notes saved!" Snackbar
    setNotesSaved(true);
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
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

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'stretch',
          gap: 3,
        }}
      >
        {/* Main Processing Panel */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}
          >
            <TextField
              label="Enter academic text"
              multiline
              fullWidth
              rows={6}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              variant="outlined"
              margin="normal"
              sx={{ mb: 1 }}
            />

            <Typography variant="caption" sx={{ display: 'block', mb: 2, opacity: 0.7 }}>
              Characters: {inputText.length}
            </Typography>

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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || inputText.trim() === ''}
              fullWidth
              sx={{ mb: 2 }}
            >
              {loading ? 'Processing...' : 'Submit'}
            </Button>

            <Button variant="outlined" color="secondary" fullWidth onClick={handleClear}>
              Clear Input & Output
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

              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Mode:{' '}
                {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1).replace(/_/g, ' ')}
              </Typography>

              <Box sx={{ whiteSpace: 'pre-line', lineHeight: 1.7, mb: 2 }}>
                {result.split('\n').map((line, index) => {
                  const match = line.match(/^([^:]+):\s*(.*)$/);
                  if (match && selectedMode === 'define') {
                    return (
                      <Typography key={index} variant="body1" align="left" sx={{ lineHeight: 1.7 }}>
                        <strong>{match[1]}:</strong> {match[2]}
                      </Typography>
                    );
                  } else {
                    return (
                      <Typography key={index} variant="body1" align="left" sx={{ lineHeight: 1.7 }}>
                        {line}
                      </Typography>
                    );
                  }
                })}
              </Box>

              <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                Word count: {result.split(/\s+/).filter(Boolean).length}
              </Typography>

              <Button variant="outlined" onClick={handleDownload} fullWidth sx={{ mt: 2 }}>
                Download Result as .txt
              </Button>

              <Button variant="outlined" onClick={handleCopyToClipboard} fullWidth sx={{ mt: 2 }}>
                Copy Output to Clipboard
              </Button>
            </Box>
          )}
        </Paper>

        {/* Notes Section */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Notes
          </Typography>

          <TextField
            label="Notes"
            multiline
            fullWidth
            rows={12}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            variant="outlined"
            margin="normal"
            sx={{ flexGrow: 1 }}
          />

          <Button onClick={handleDownloadNotes} variant="outlined" fullWidth sx={{ mt: 2 }}>
            Download Notes as .txt
          </Button>
        </Paper>
      </Box>

      {/* Snackbar for Copy Success */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={2000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setCopySuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          Output copied to clipboard!
        </MuiAlert>
      </Snackbar>

      {/* Snackbar for Notes Saved */}
      <Snackbar
        open={notesSaved}
        autoHideDuration={2000}
        onClose={() => setNotesSaved(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setNotesSaved(false)}
          severity="success"
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          Notes saved!
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};

export default TextProcessor;
