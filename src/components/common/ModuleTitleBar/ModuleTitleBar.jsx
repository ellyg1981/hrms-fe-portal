import React from 'react';
import './ModuleTitleBar.css';

function ModuleTitleBar({ title, subtitle, color = '#0B2E59', ctaLabel, onCta, avatar, children }) {
  return (
    <div className="mtb-wrap" style={{ borderLeftColor: color }}>
      <div className="mtb-left">
        <div className="mtb-dot" style={{ background: color }} />
        <div className="mtb-text">
          <h2 className="mtb-title">{title}</h2>
          {subtitle && <p className="mtb-sub">{subtitle}</p>}
        </div>
      </div>

      {children && <div className="mtb-right">{children}</div>}

      {ctaLabel && (
        <button className="mtb-cta" onClick={onCta}>
          {ctaLabel}
        </button>
      )}

      {avatar && (
        <div className="mtb-avatar" style={{ background: color }}>
          {typeof avatar === 'string' ? (
            <img src={avatar} alt="avatar" />
          ) : (
            avatar
          )}
        </div>
      )}
    </div>
  );
}

export default ModuleTitleBar;
