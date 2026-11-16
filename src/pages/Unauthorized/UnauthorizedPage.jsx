import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cardMotion } from '../../utils/motion';
import './UnauthorizedPage.css';

function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="unauthorized-page">
      <motion.div className="unauthorized-card" {...cardMotion(0, { hover: false })}>
        <div className="unauthorized-icon">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>
        <h1 className="unauthorized-title">Access Denied</h1>
        <p className="unauthorized-message">
          You are not authorized to view this page. If you believe this is a
          mistake, please contact your system administrator.
        </p>
        <div className="unauthorized-actions">
          <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default UnauthorizedPage;
