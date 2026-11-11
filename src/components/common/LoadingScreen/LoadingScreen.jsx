import React from 'react';
import uhamiajiLogo from '../../../assets/images/uhamiaji_logo.png';
import './LoadingScreen.css';

function LoadingScreen({ message = 'Loading...', title = 'HRMS Staff Portal' }) {
  return (
    <div className="loading-screen" role="status" aria-live="polite" aria-busy="true">
      <div className="loading-screen-bg" />
      <div className="loading-screen-overlay" />

      <div className="loading-screen-content">
        <div className="loading-screen-logo">
          <img src={uhamiajiLogo} alt="Uhamiaji Logo" />
        </div>
        <div className="loading-screen-title">{title}</div>
        <div className="loading-screen-message">
          <span className="loading-screen-spinner" />
          {message}
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
