import React from 'react';
import './ServiceCard.css';

function ServiceCard({
  icon,
  title,
  description,
  actionText = 'Open Module',
  onClick,
  badge,
  iconBg = 'var(--color-sky-blue)',
  iconColor = 'var(--color-primary)',
  ariaLabel,
}) {
  return (
    <button
      type="button"
      className="service-card"
      onClick={onClick}
      aria-label={ariaLabel || title}
    >
      <div className="service-card__top">
        <div
          className="service-card__icon-wrap"
          style={{ background: iconBg, color: iconColor }}
          aria-hidden="true"
        >
          {icon}
        </div>
        {badge && <span className="service-card__badge">{badge}</span>}
      </div>

      <div className="service-card__content">
        <h3 className="service-card__title">{title}</h3>
        <p className="service-card__description">{description}</p>
      </div>

      <div className="service-card__action">
        <span>{actionText}</span>
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

export default ServiceCard;
