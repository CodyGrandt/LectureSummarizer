// src/components/TextProcessor.tsx

import React, { useState } from 'react';

const TextProcessor: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [selectedMode, setSelectedMode] = useState('simplify');
  const [result, setResult] = useState('');

  const modes = [
    'simplify',
    'summarize',
    'bullet',
    'complexify',
    'question',
    'define',
    'explain_like_im_5'
  ];

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

const response = await fetch('https://lecturesummarizer.onrender.com/process-text', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: inputText, mode: selectedMode }),
  });

  const data = await response.json();
  console.log('Server response:', data); // <-- Add this
  setResult(data.output);
};


  return (
    <div>
      <h1>LectureSimplifier</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter academic text here..."
          rows={6}
          cols={50}
        />
        <br />
        <select value={selectedMode} onChange={(e) => setSelectedMode(e.target.value)}>
          {modes.map((mode) => (
            <option key={mode} value={mode}>
              {mode.charAt(0).toUpperCase() + mode.slice(1).replace(/_/g, ' ')}
            </option>
          ))}
        </select>
        <br />
        <button type="submit">Submit</button>
      </form>

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h3>Output:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default TextProcessor;
