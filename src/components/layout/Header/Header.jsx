import React from 'react';
import uhamiajiLogo from '../../../assets/images/uhamiaji_logo.png';
import coatOfArms from '../../../assets/images/coat_of_arms.png';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="header-brand">
        <img src={coatOfArms} alt="Coat of Arms" className="header-logo" />
        <div className="header-titles">
          <h1 className="header-title">IMMIGRATION SERVICES DEPARTMENT</h1>
          <span className="header-subtitle">HRMS STAFF PORTAL</span>
          <div className="header-title-line" />
        </div>
        <img src={uhamiajiLogo} alt="Uhamiaji Logo" className="header-logo header-logo--right" />
      </div>
    </header>
  );
}

export default Header;
