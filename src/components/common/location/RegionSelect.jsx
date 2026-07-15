import React, { useState, useRef, useEffect } from 'react';
import { getRegions } from '../../../data/locations';
import './LocationSelect.css';

function RegionSelect({ value, onChange, disabled, placeholder = 'Select Region', required, id }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const regions = getRegions();

  const filtered = search
    ? regions.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : regions;

  const selectedLabel = value || placeholder;

  useEffect(() => {
    if (!open) { setSearch(''); return; }
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSelect = (regionName) => {
    onChange(regionName);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setOpen(false);
    setSearch('');
  };

  return (
    <div className="loc-select-wrapper" ref={containerRef}>
      <div
        className={`loc-select-trigger ${disabled ? 'loc-select-trigger--disabled' : ''} ${open ? 'loc-select-trigger--open' : ''}`}
        onClick={() => { if (!disabled) setOpen(v => !v); }}
        id={id}
      >
        <span className={`loc-select-value ${!value ? 'loc-select-placeholder' : ''}`}>{selectedLabel}</span>
        <div className="loc-select-icons">
          {value && !disabled && (
            <button type="button" className="loc-select-clear" onClick={handleClear} aria-label="Clear">×</button>
          )}
          <svg className={`loc-select-chevron ${open ? 'loc-select-chevron--open' : ''}`} viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
      </div>
      {open && (
        <div className="loc-select-dropdown">
          <div className="loc-select-search">
            <input
              ref={inputRef}
              type="text"
              className="loc-select-search-input"
              placeholder="Search region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="loc-select-options">
            {filtered.length === 0 ? (
              <div className="loc-select-no-results">No regions found</div>
            ) : (
              filtered.map((r) => (
                <div
                  key={r.id}
                  className={`loc-select-option ${value === r.name ? 'loc-select-option--selected' : ''}`}
                  onClick={() => handleSelect(r.name)}
                >
                  {r.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {required && <input type="hidden" value={value || ''} required readOnly />}
    </div>
  );
}

export default RegionSelect;
