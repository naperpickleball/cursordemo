import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SiriIntegration = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const navigate = useNavigate();
  
  const startListening = () => {
    setIsListening(true);
    // Add your speech recognition logic here
  };
  
  const stopListening = () => {
    setIsListening(false);
    // Add your speech recognition stop logic here
  };
  
  const goToDashboard = () => {
    navigate('/dashboard');
  };
  
  return (
    <div className="siri-integration">
      <h1>Siri Integration</h1>
      <div className="controls">
        <button 
          onClick={isListening ? stopListening : startListening}
          className={isListening ? 'listening' : ''}
        >
          {isListening ? 'Stop Listening' : 'Start Listening'}
        </button>
        <button onClick={goToDashboard}>Go to Dashboard</button>
      </div>
      {transcript && (
        <div className="transcript">
          <h3>Transcript:</h3>
          <p>{transcript}</p>
        </div>
      )}
    </div>
  );
};

export default SiriIntegration;
