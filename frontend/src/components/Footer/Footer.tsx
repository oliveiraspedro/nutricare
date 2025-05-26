import React from "react";
import "./Footer.css";
import waveFooter from "../../assets/img/wave-footer.png";
import logo from "../../assets/img/NutriCare_Logo.webp";

const Footer: React.FC = () => {
  return (
    <>
      <div className="wave-divider">
        {/*<svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg">
          <path
            fill="#2196f3"
            d="M0,64L48,74.7C96,85,192,107,288,112C384,117,480,107,576,90.7C672,75,768,53,864,58.7C960,64,1056,96,1152,101.3C1248,107,1344,85,1392,74.7L1440,64V0H1392C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0H0Z"
          ></path>
        </svg>*/}
        <img src={waveFooter} alt="Footer" />
      </div>
      {/* Rodapé azul escuro */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "13rem",
                height: "5rem",
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
            <p className="footer-text">
              © 2025 NutriCare - Software nutricional
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Links úteis</h3>
            <ul className="footer-list">
              <li>
                <a href="#">Termos de Uso</a>
              </li>
              <li>
                <a href="#">Política de Privacidade</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Suporte</h3>
            <ul className="footer-list">
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contatos</h3>
            <ul className="footer-list">
              <li>NutriCare@gmail.com</li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
