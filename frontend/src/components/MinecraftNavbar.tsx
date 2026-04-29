import React from 'react';
import { Search, User, ChevronDown, Menu } from 'lucide-react';
import './MinecraftNavbar.css';

const MinecraftNavbar: React.FC = () => {
  return (
    <nav className="mc-navbar">
      <div className="mc-navbar-container">
        {/* Left: Logo */}
        <div className="mc-navbar-left">
          <button className="mc-mobile-menu lg:hidden">
            <Menu size={24} />
          </button>
          <div className="mc-logo">
            <svg viewBox="0 0 100 20" width="120" height="24">
              <text x="0" y="16" fill="white" fontSize="16" fontWeight="bold" fontFamily="'Minecraft', sans-serif">MINECRAFT</text>
            </svg>
          </div>
        </div>

        {/* Center: Links */}
        <div className="mc-navbar-center hidden lg:flex">
          <ul className="mc-nav-links">
            <li>GAMES <ChevronDown size={14} /></li>
            <li>SHOP <ChevronDown size={14} /></li>
            <li>EXPLORE <ChevronDown size={14} /></li>
            <li>LEARN <ChevronDown size={14} /></li>
            <li>SUPPORT <ChevronDown size={14} /></li>
          </ul>
        </div>

        {/* Right: Actions */}
        <div className="mc-navbar-right">
          <button className="mc-buy-btn hidden sm:block">BUY MINECRAFT</button>
          <div className="mc-icon-actions">
            <button className="mc-icon-btn"><Search size={20} /></button>
            <button className="mc-icon-btn"><User size={20} /></button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MinecraftNavbar;
