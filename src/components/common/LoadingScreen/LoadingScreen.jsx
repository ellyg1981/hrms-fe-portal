import React from 'react';
import './LoadingScreen.css';

function LoadingScreen({ message = 'Loading...' }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-busy="true">
      <div className="loading-screen-spinner" />
      <p className="loading-screen-text">{message}</p>
    </div>
  );
}

export default LoadingScreen;
