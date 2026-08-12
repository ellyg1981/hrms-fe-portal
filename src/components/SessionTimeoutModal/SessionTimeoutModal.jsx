import React, { useEffect, useState } from 'react';
import Modal from '../common/Modal/Modal';
import './SessionTimeoutModal.css';

function SessionTimeoutModal({ isOpen, onContinue, onLogout, timeLeftSeconds }) {
  const [remaining, setRemaining] = useState(timeLeftSeconds);

  useEffect(() => {
    setRemaining(timeLeftSeconds);
  }, [timeLeftSeconds]);

  useEffect(() => {
    if (!isOpen || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isOpen, remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title="Session Timeout Warning"
      size="sm"
      footer={
        <div className="session-timeout-actions">
          <button className="btn btn-secondary" onClick={onLogout}>
            Logout
          </button>
          <button className="btn btn-primary" onClick={onContinue}>
            Continue Session
          </button>
        </div>
      }
    >
      <div className="session-timeout-body">
        <p>Your session will expire soon due to inactivity.</p>
        <div className="session-timeout-countdown">
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <p className="session-timeout-hint">
          Click <strong>Continue Session</strong> to stay logged in.
        </p>
      </div>
    </Modal>
  );
}

export default SessionTimeoutModal;
