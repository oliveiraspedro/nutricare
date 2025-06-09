import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom"; // Importa NavLink
import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/img/NutriCare_Logo.webp";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    // Verifica o estado de autenticação do usuário
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("email");
    setIsLoggedIn(false);
    navigate("/login"); // Redireciona para a página de login após o logout
  };

  return (
    <header className="header-container">
      <div className="logo-container">
        <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
        >
          <img
            src={logo}
            alt="Logo NutriCare"
            className="logo"
            style={{
              width: "13rem",
              height: "3rem",
              objectFit: "cover",
              objectPosition: "center",
            }}
          />
        </NavLink>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
        <div className={`bar ${menuOpen ? "open" : ""}`}></div>
      </div>

      {!isLoggedIn && (
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/dietas"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Dietas
          </NavLink>
          <NavLink
            to="/register"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Cadastro
          </NavLink>
        </nav>
      )}

      <div className={`auth-buttons ${menuOpen ? "active" : ""}`}>
        {isLoggedIn ? (
          <button
            onClick={() => {
              handleLogout();
              setMenuOpen(false);
            }}
            className="auth-button logout"
          >
            Sair
          </button>
        ) : (
          <NavLink to="/login" onClick={() => setMenuOpen(false)}>
            <button className="auth-button login">Login</button>
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
