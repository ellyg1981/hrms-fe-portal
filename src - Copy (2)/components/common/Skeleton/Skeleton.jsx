import React from 'react';
import './Skeleton.css';

function Skeleton({ width, height, circle, className = '' }) {
  return (
    <div
      className={`skeleton-item ${circle ? 'skeleton-circle' : ''} ${className}`}
      style={{ width, height }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <Skeleton height="16px" width="60%" className="skeleton-mb" />
      <Skeleton height="32px" width="40%" className="skeleton-mb" />
      <Skeleton height="12px" width="80%" />
    </div>
  );
}

export function SkeletonTable({ rows = 4 }) {
  return (
    <div className="skeleton-table">
      <Skeleton height="36px" width="100%" className="skeleton-mb" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} height="48px" width="100%" className="skeleton-mb" />
      ))}
    </div>
  );
}

export default Skeleton;
