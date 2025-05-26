// src/pages/Cadastro/Login.tsx

import React, { useState, useEffect } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import { Link } from "react-router-dom";
import "./Login.css";
import medicoicon from "../../assets/img/image-doutor.png";
import pacienteicon from "../../assets/img/image-paciente.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [crm, setCrm] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [crmError, setCrmError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  type AccountUser = "medico" | "paciente";
  const [type, setType] = useState<AccountUser>("medico");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ email, password });
  };

  const handleSwitchToRegister = () => {
    // Redirecionar para cadastro
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  useEffect(() => {
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const senhaValida = password.length >= 6;

    setEmailError(
      emailValido || email === "" ? "" : "Digite um e-mail válido."
    );
    setPasswordError(
      senhaValida || password === ""
        ? ""
        : "A senha deve ter pelo menos 6 caracteres."
    );
    setIsFormValid(emailValido && senhaValida);
  }, [email, password]);

  return (
    <AuthForm
      buttonText="Entrar"
      alternateText="Ainda não tem conta?"
      alternateLinkText="Cadastre-se"
      onSubmit={handleLogin}
      onBottomLinkClick={handleSwitchToRegister}
      buttonId="login-button"
      linkTo="/register"
      isDisabled={!isFormValid}
    >
      <div className="tipo-conta">
        <div
          onClick={() => setType("medico")}
          className={type === "medico" ? "tipo ativo" : "tipo"}
        >
          <img src={medicoicon} alt="Médico" />
          <span>Médico</span>
        </div>
        <div
          onClick={() => setType("paciente")}
          className={type === "paciente" ? "tipo ativo" : "tipo"}
        >
          <img src={pacienteicon} alt="Paciente" />
          <span>Paciente</span>
        </div>
      </div>

      {/* Campo de e-mail */}
      <div
        style={type === "medico" ? { display: "none" } : { display: "flex" }}
        className="input-container"
      >
        <span className="material-symbols-outlined input-icon">mail</span>
        <input
          id="email"
          type="email"
          placeholder=" "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <label htmlFor="email">E-mail</label>
        <div className="error">{emailError || "\u00A0"}</div>
      </div>

      {/* Campo de CRM*/}
      <div
        style={type === "paciente" ? { display: "none" } : { display: "flex" }}
        className="input-container"
      >
        <span className="material-symbols-outlined input-icon">badge</span>
        <input
          id="crm"
          type="text"
          placeholder=" "
          value={crm}
          onChange={(e) => setCrm(e.target.value)}
          required
          autoComplete="email"
        />
        <label htmlFor="email">CRM</label>
        <div className="error">{crmError || "\u00A0"}</div>
      </div>

      {/* Campo de senha */}
      <div className="input-container">
        <div style={{ position: "relative" }}>
          <span className="material-symbols-outlined input-icon">lock</span>
          <input
            id="senha"
            type={showPassword ? "text" : "password"}
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <label htmlFor="senha">Senha</label>
          {password && (
            <span
              onClick={togglePasswordVisibility}
              className="material-symbols-outlined password-toggle-icon"
              aria-label="Mostrar ou ocultar senha"
            >
              {showPassword ? "visibility" : "visibility_off"}
            </span>
          )}
        </div>
        <div className="forgot-password">
          Esqueceu a senha?{" "}
          <Link to="/forgotPassword" className="recover-link">
            Recupere aqui
          </Link>
        </div>
        <div className="error">{passwordError || "\u00A0"}</div>
      </div>
    </AuthForm>
  );
};

export default LoginPage;
