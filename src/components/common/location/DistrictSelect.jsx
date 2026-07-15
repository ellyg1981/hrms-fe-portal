import React, { useState, useRef, useEffect } from 'react';
import { getDistricts } from '../../../data/locations';
import './LocationSelect.css';

function DistrictSelect({ value, onChange, region, disabled, placeholder = 'Select District', required, id }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const districts = getDistricts(region);
  const isDisabled = disabled || !region;

  const filtered = search
    ? districts.filter(d => d.name.toLowerCase().includes(search.toLowerCase()))
    : districts;

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

  const handleSelect = (districtName) => {
    onChange(districtName);
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
        className={`loc-select-trigger ${isDisabled ? 'loc-select-trigger--disabled' : ''} ${open ? 'loc-select-trigger--open' : ''}`}
        onClick={() => { if (!isDisabled) setOpen(v => !v); }}
        id={id}
      >
        <span className={`loc-select-value ${!value ? 'loc-select-placeholder' : ''}`}>{selectedLabel}</span>
        <div className="loc-select-icons">
          {value && !isDisabled && (
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
              placeholder="Search district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="loc-select-options">
            {filtered.length === 0 ? (
              <div className="loc-select-no-results">{region ? 'No districts found' : 'Select a region first'}</div>
            ) : (
              filtered.map((d) => (
                <div
                  key={d.id}
                  className={`loc-select-option ${value === d.name ? 'loc-select-option--selected' : ''}`}
                  onClick={() => handleSelect(d.name)}
                >
                  {d.name}
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

export default DistrictSelect;
