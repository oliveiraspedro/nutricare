import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/img/NutriCare_Logo.webp";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    if (token) {
      setIsLoggedIn(true);
      setUserType(userType);
    } else {
      setIsLoggedIn(false);
      setUserType(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("email");
    localStorage.removeItem("crm");
    setIsLoggedIn(false);
    setUserType(null);
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header-container">
      <div className="logo-container">
        <NavLink to="/" end onClick={() => setMenuOpen(false)}>
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

      {!isLoggedIn ? (
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
            to="/register"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Cadastro
          </NavLink>
        </nav>
      ) : (
        <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
          <NavLink
            to="/"
            end
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
          {userType === "medico" ? (
            <NavLink
              to="/pacientes"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Pacientes
            </NavLink>
          ) : (
            <NavLink
              to="/dietas"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Dietas
            </NavLink>
          )}
          <NavLink
            to="/perfil"
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Perfil
          </NavLink>
        </nav>
      )}

      <div className={`auth-buttons ${menuOpen ? "active" : ""}`}>
        {isLoggedIn ? (
          <button onClick={handleLogout} className="auth-button logout">
            Sair
          </button>
        ) : (
          <NavLink to="/login" onClick={closeMenu}>
            <button className="auth-button login">Login</button>
          </NavLink>
        )}
      </div>
    </header>
  );
};

export default Header;
