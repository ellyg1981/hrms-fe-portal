import React, { useState, useEffect } from 'react';
import { findDemoEmployee } from '../../data/demoEmployees';
import { notificationService } from '../../components/Notifications/notificationService';

const LockIcon = () => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
    <rect x="5" y="11" width="14" height="10" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const FG = ({ label, children, error }) => (
  <div className={`form-group${error ? ' form-group--error' : ''}`}>
    <label className="form-label">{label}</label>
    {children}
    {error && <span className="reg-form-error">{error}</span>}
  </div>
);

function EmployeeSearchTab({
  onPopulate,
  initialCheckNumber = '',
  initialNin = '',
  initialForceNumber = '',
  readOnly = false,
  searchFn = null,
}) {
  const [nin, setNin] = useState(initialNin);
  const [checkNumber, setCheckNumber] = useState(initialCheckNumber);
  const [forceNumber, setForceNumber] = useState(initialForceNumber);
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (readOnly) {
      setNin(initialNin);
      setCheckNumber(initialCheckNumber);
      setForceNumber(initialForceNumber);
    }
  }, [initialNin, initialCheckNumber, initialForceNumber, readOnly]);

  const canSearch = () => nin.trim() || checkNumber.trim() || forceNumber.trim();

  const handleSearch = async () => {
    setSearchError('');
    if (!canSearch()) {
      setSearchError(
        readOnly
          ? 'Employee identification information is unavailable. Please contact Human Resources for assistance.'
          : 'Please enter a Check Number, National ID (NIN), or Force Number'
      );
      return;
    }
    setSearching(true);
    try {
      if (searchFn) {
        const data = await notificationService.promise(
          searchFn({ checkNumber, nin, forceNumber }),
          {
            loading: 'Searching employee record...',
            success: 'Employee information retrieved successfully.',
            error: 'Employee record could not be found. Please contact HR if your employee information is incomplete.',
          }
        );
        onPopulate(data);
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        const data = findDemoEmployee({ checkNumber, nin, forceNumber });
        if (data) {
          onPopulate(data);
        } else {
          setSearchError('No employee record found. Please verify your entries and try again.');
        }
      }
    } catch {
      if (!searchFn) {
        setSearchError('No employee record found. Please verify your entries and try again.');
      }
    } finally {
      setSearching(false);
    }
  };

  const labelWithLock = (text) => (readOnly ? <><LockIcon /> {text}</> : text);

  const inputClass = readOnly ? 'form-input form-input--readonly' : 'form-input';

  return (
    <div className="leave-form-section">
      <h4 className="leave-form-section-title">Employee Search</h4>
      <p className="leave-form-hint">
        {readOnly
          ? 'Your employee identifiers are shown below. Click Search to retrieve your employee record and populate your profile.'
          : 'Enter an existing employee\'s National ID (NIN), Check Number, or Force Number to auto-populate the registration form with their details.'}
      </p>
      <div className="leave-form-row">
        <FG label={labelWithLock('National ID (NIN)')} error={searchError && !nin && !checkNumber && !forceNumber ? searchError : ''}>
          <input
            type="text"
            className={inputClass}
            value={nin}
            onChange={readOnly ? undefined : e => { setNin(e.target.value); setSearchError(''); }}
            readOnly={readOnly}
            disabled={readOnly}
            placeholder="e.g. 19850101-00001-00001-01"
          />
        </FG>
        <FG label={labelWithLock('Check Number')}>
          <input
            type="text"
            className={inputClass}
            value={checkNumber}
            onChange={readOnly ? undefined : e => { setCheckNumber(e.target.value); setSearchError(''); }}
            readOnly={readOnly}
            disabled={readOnly}
            placeholder="e.g. CHK-00000001"
          />
        </FG>
        <FG label={labelWithLock('Force Number')}>
          <input
            type="text"
            className={inputClass}
            // value={forceNumber}
            value=""
            onChange={readOnly ? undefined : e => { setForceNumber(e.target.value); setSearchError(''); }}
            readOnly={readOnly}
            disabled={readOnly}
            placeholder="e.g. F0000001"
          />
        </FG>
        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={handleSearch} disabled={searching || !canSearch()} style={{ height: '48px', width: '100%' }}>
            {searching ? 'Searching...' : 'Search Employee'}
          </button>
        </div>
      </div>
      {searchError && (nin || checkNumber || forceNumber) && (
        <div className="reg-form-error" style={{ marginTop: '8px' }}>{searchError}</div>
      )}
    </div>
  );
}

export default EmployeeSearchTab;
