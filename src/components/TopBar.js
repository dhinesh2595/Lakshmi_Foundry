import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';

const TopBar = ({ onToggleMenu }) => {
  return (
    <div className="top-bar">
      <button className="hamburger-icon" onClick={onToggleMenu}>
        <GiHamburgerMenu size={24} />
      </button>
      {/* Additional top bar content */}
    </div>
  );
};

export default TopBar;