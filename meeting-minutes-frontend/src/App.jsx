import React, { useState } from 'react';

// Use environment variable or fallback to default
const WEBHOOK_URL = "/webhook-test/meeting-minutes";
const API_TIMEOUT = import.meta.env.VITE_API_TIMEOUT || 30000;
const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE === 'true';

function App() {
  const [transcript, setTranscript] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
        setFile(selectedFile);
        
        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
          setTranscript(e.target.result);
        };
        reader.readAsText(selectedFile);
        
        setMessage('');
      } else {
        setMessage('Please select a .txt file only.');
        setMessageType('error');
        setFile(null);
        event.target.value = '';
      }
    }
  };

  const handleTranscriptChange = (event) => {
    setTranscript(event.target.value);
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!transcript.trim()) {
      setMessage('Please provide a meeting transcript.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      console.log('Preparing to send transcript to n8n...');
      console.log('Transcript text:', transcript.trim());
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: transcript.trim() }),
        signal: controller.signal
      };
      console.log('Fetch options:', fetchOptions);
      const response = await fetch(WEBHOOK_URL, fetchOptions);
      clearTimeout(timeoutId);
      console.log('Fetch response status:', response.status);
      const contentType = response.headers.get('content-type');
      console.log('Response content-type:', contentType);
      let data;
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
      console.log('Response data:', data);
      if (DEBUG_MODE) {
        console.log('Response status:', response.status);
      }
      if (response.ok) {
        setMessage('Success! Minutes sent.');
        setMessageType('success');
        setTranscript('');
        setFile(null);
        // Reset file input
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setMessage('Request timeout. Please check your connection and try again.');
      } else {
        console.error('Error sending transcript:', error);
        setMessage('Error sending transcript. Please try again.');
      }
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Meeting Minutes Generator</h1>
        <p>Upload a meeting transcript or paste it below to generate and distribute meeting minutes.</p>
      </header>

      {message && (
        <div className={`message ${messageType === 'success' ? 'success-message' : 'error-message'}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="upload-section">
          <h3>Upload Transcript File</h3>
          <div className="file-input">
            <input
              id="file-input"
              type="file"
              accept=".txt"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>
          {file && (
            <div className="file-info">
              Selected file: {file.name} ({Math.round(file.size / 1024)} KB)
            </div>
          )}
          <p>Accepts .txt files only</p>
        </div>

        <div className="textarea-section">
          <label htmlFor="transcript">Or Paste Transcript Here:</label>
          <textarea
            id="transcript"
            className="transcript-textarea"
            value={transcript}
            onChange={handleTranscriptChange}
            placeholder="Paste your meeting transcript here..."
            disabled={loading}
          />
        </div>

        {loading && (
          <div className="loading">
            Processing transcript and generating minutes...
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
          disabled={loading || !transcript.trim()}
        >
          {loading ? 'Processing...' : 'Generate Meeting Minutes'}
        </button>
      </form>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Instructions:</h4>
        <ol>
          <li>Upload a .txt file containing your meeting transcript, or paste the text directly</li>
          <li>Click "Generate Meeting Minutes" to process the transcript</li>
          <li>The system will automatically:
            <ul>
              <li>Extract participant email addresses</li>
              <li>Generate professional meeting minutes using AI</li>
              <li>Create a Google Doc with the minutes</li>
              <li>Send the minutes via email to all participants</li>
            </ul>
          </li>
        </ol>
        <p><strong>Note:</strong> Make sure to update the WEBHOOK_URL constant in the code with your actual n8n webhook URL.</p>
      </div>
    </div>
  );
}

export default App;
