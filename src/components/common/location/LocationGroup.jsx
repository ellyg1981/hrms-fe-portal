import React from 'react';
import RegionSelect from './RegionSelect';
import DistrictSelect from './DistrictSelect';
import WardSelect from './WardSelect';

function LocationGroup({ region, district, ward, onChange, disabled, required, labels = {} }) {
  const handleRegionChange = (val) => {
    onChange({ region: val, district: '', ward: '' });
  };
  const handleDistrictChange = (val) => {
    onChange({ region, district: val, ward: '' });
  };
  const handleWardChange = (val) => {
    onChange({ region, district, ward: val });
  };

  return (
    <div className="loc-group">
      <div className="form-group">
        <label className="form-label">{labels.region || 'Region'}</label>
        <RegionSelect
          value={region}
          onChange={handleRegionChange}
          disabled={disabled}
          placeholder={labels.regionPlaceholder || 'Select Region'}
          required={required}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{labels.district || 'District'}</label>
        <DistrictSelect
          value={district}
          onChange={handleDistrictChange}
          region={region}
          disabled={disabled}
          placeholder={labels.districtPlaceholder || 'Select District'}
          required={required}
        />
      </div>
      <div className="form-group">
        <label className="form-label">{labels.ward || 'Ward'}</label>
        <WardSelect
          value={ward}
          onChange={handleWardChange}
          district={district}
          disabled={disabled}
          placeholder={labels.wardPlaceholder || 'Select Ward'}
          required={required}
        />
      </div>
    </div>
  );
}

export default LocationGroup;
