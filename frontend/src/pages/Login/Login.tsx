// src/pages/Cadastro/Login.tsx

import React, { useState, useEffect } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import medicoicon from "../../assets/img/image-doutor.png";
import pacienteicon from "../../assets/img/image-paciente.png";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [crm, setCrm] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [crmError, setCrmError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  type AccountUser = "medico" | "paciente";
  const [accountType, setAccountType] = useState<AccountUser>("medico");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (accountType === "medico") {
      const newMedico = {
        crm: crm,
        password: password,
      };

      try {
        const response = await fetch("http://localhost:8080/api/login/medico", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMedico),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Login efetuado com sucesso:", result);
          alert("Login efetuado com sucesso:");
        } else {
          console.error("Erro ao efetuar login", result);
          alert(result.message || "Erro ao efetuar login. Tente novamente.");
          return;
        }

        // Limpar campos
        setCrm("");
        setPassword("");

        // Redirecionar para login
        //navigate("/login");

        alert("Login efetuado com sucesso!");
      } catch (error) {
        console.error("Erro no cadastro:", error);
        alert("Erro ao cadastrar. Tente novamente.");
      }
    }
  };

  const handleSwitchToRegister = () => {
    // Redirecionar para cadastro
  };

  const handleChangeAccountType = () => {
    setAccountType(accountType === "paciente" ? "medico" : "paciente");
    setEmail("");
    setCrm("");
    setPassword("");
    setEmailError("");
    setCrmError("");
    setPasswordError("");
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

    let crmFilled = true;
    if (accountType === "medico") {
      crmFilled = crm.trim() !== "";
      setCrmError(
        crmFilled || crm === "" ? "" : "O CRM é obrigatório para médicos."
      );
    } else {
      setCrmError("");
    }

    setPasswordError(
      senhaValida || password === ""
        ? ""
        : "A senha deve ter pelo menos 6 caracteres."
    );

    let formIsValid = emailValido && senhaValida;

    if (accountType === "medico") {
      formIsValid = crmFilled && senhaValida;
    }

    setIsFormValid(formIsValid);
  }, [email, password, crm, accountType]);

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
          onClick={handleChangeAccountType}
          className={accountType === "medico" ? "tipo ativo" : "tipo"}
        >
          <img src={medicoicon} alt="Médico" />
          <span>Médico</span>
        </div>
        <div
          onClick={handleChangeAccountType}
          className={accountType === "paciente" ? "tipo ativo" : "tipo"}
        >
          <img src={pacienteicon} alt="Paciente" />
          <span>Paciente</span>
        </div>
      </div>

      {/* Campo de e-mail */}
      {accountType === "paciente" && (
        <div style={{ display: "flex" }} className="input-container">
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
      )}

      {/* Campo de CRM*/}
      {accountType === "medico" && (
        <div className="input-container">
          <span className="material-symbols-outlined input-icon">badge</span>
          <input
            id="crm"
            type="text"
            placeholder=" "
            value={crm}
            onChange={(e) => setCrm(e.target.value)}
            required
            autoComplete="off"
          />
          <label htmlFor="crm">CRM</label>
          <div className="error">{crmError || "\u00A0"}</div>
        </div>
      )}

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
