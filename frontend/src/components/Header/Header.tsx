import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/img/NutriCare_Logo.webp";

const Header: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("userType");

    if (token && type) {
      setIsLoggedIn(true);
      setUserType(type);
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
        {/* O link da logo vai para a home correta se estiver logado */}
        <NavLink to={isLoggedIn ? (userType === 'medico' ? '/pacientes' : '/dietas') : '/'} end onClick={closeMenu}>
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
      
      {/* ESTRUTURA DE NAVEGAÇÃO */}
      <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
        {isLoggedIn ? (
          // Links para usuários LOGADOS
          <>
            {userType === 'medico' && (
              // Links específicos para MÉDICO
              <>
                <NavLink to="/pacientes" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>Home</NavLink>
                <NavLink to="/perfil" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>Perfil</NavLink>
              </>
            )}
            {userType === 'paciente' && (
              // Links específicos para PACIENTE
              <>
                <NavLink to="/dietas" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>Minha Dieta</NavLink>
                <NavLink to="/perfil" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>Perfil</NavLink>
              </>
            )}
          </>
        ) : (
          // Links para visitantes (NÃO LOGADOS)
          <>
            <NavLink to="/" end onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>Home</NavLink>
            <NavLink to="/dietas" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>Dietas</NavLink>
            <NavLink to="/register" onClick={closeMenu} className={({ isActive }) => (isActive ? "active-link" : "")}>Cadastro</NavLink>
          </>
        )}
      </nav>

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