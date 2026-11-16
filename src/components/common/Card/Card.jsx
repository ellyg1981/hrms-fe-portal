import React from 'react';
import { motion } from 'framer-motion';
import { cardMotion } from '../../../utils/motion';
import './Card.css';

function Card({ children, className = '', padding = 'normal', hover = true, index = 0 }) {
  const padClass = padding === 'none' ? 'card--no-padding' : padding === 'large' ? 'card--large-padding' : '';
  return (
    <motion.div className={`card ${hover ? 'card--hover' : ''} ${padClass} ${className}`} {...cardMotion(index, { hover })}>
      {children}
    </motion.div>
  );
}

export function CardHeader({ title, subtitle, action, icon }) {
  return (
    <div className="card-header">
      <div className="card-header-left">
        {icon && <span className="card-header-icon">{icon}</span>}
        <div>
          {title && <h3 className="card-header-title">{title}</h3>}
          {subtitle && <p className="card-header-subtitle">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="card-header-action">{action}</div>}
    </div>
  );
}

export default Card;
