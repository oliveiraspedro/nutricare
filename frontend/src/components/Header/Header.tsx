import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Importa NavLink
import './Header.css';
import logo from '../../assets/img/NutriCare_Logo.webp';

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleLogin = () => setIsLoggedIn(!isLoggedIn);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="header-container">
      <div className="logo-container">
        <img src={logo} alt="Logo NutriCare" className="logo" style={{ width: '13rem', height: '3rem', objectFit: 'cover', objectPosition: 'center' }} />
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
      </div>

      <nav className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <NavLink to="/" end onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>Home</NavLink>
        <NavLink to="/dietas" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>Dietas</NavLink>
        <NavLink to="/register" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? 'active-link' : ''}>Cadastro</NavLink>
      </nav>

      <div className={`auth-buttons ${menuOpen ? 'active' : ''}`}>
        {isLoggedIn ? (
          <button onClick={() => { toggleLogin(); setMenuOpen(false); }} className="auth-button logout">
            Sair
          </button>
        ) : (
          <NavLink to="/login" onClick={() => setMenuOpen(false)}>
            <button className="auth-button login">
              Login
            </button>
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
