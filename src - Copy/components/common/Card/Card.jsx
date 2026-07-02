import React from 'react';
import './Card.css';

function Card({ children, className = '', padding = 'normal', hover = true }) {
  const padClass = padding === 'none' ? 'card--no-padding' : padding === 'large' ? 'card--large-padding' : '';
  return (
    <div className={`card ${hover ? 'card--hover' : ''} ${padClass} ${className}`}>
      {children}
    </div>
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
