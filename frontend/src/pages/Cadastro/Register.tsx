// src/pages/Cadastro/Register.tsx

import React, { useState, useEffect } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom"; // redirecionar após cadastro
import "./Register.css";
import medicoicon from "../../assets/img/image-doutor.png";
import pacienteicon from "../../assets/img/image-paciente.png";

const Register: React.FC = () => {
  const navigate = useNavigate(); // para redirecionar ao login

  // Estados dos campos
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [crm, setCrm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados dos Tipos de Usuários
  type AccountUser = "medico" | "paciente";
  const [type, setType] = useState<AccountUser>("medico");

  // Validação
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Funções de validação
  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string): boolean => password.length >= 6;

  // Validações em tempo real
  useEffect(() => {
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const passwordsMatch = password === confirmPassword;

    setEmailError(emailValid || email === "" ? "" : "Digite um e-mail válido.");
    setPasswordError(
      passwordValid || password === ""
        ? ""
        : "A senha deve ter pelo menos 6 caracteres."
    );
    setConfirmPasswordError(
      passwordsMatch || confirmPassword === "" ? "" : "As senhas não coincidem."
    );

    setIsFormValid(
      emailValid &&
        passwordValid &&
        passwordsMatch &&
        fullName.trim() !== "" &&
        phone.trim() !== ""
    );
  }, [email, password, confirmPassword, fullName, phone]);

  // Enviar cadastro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const newUser = {
      name: fullName,
      email: email,
      phone: phone, 
      password: password,
    };

    try {
      const response = await fetch("http://localhost:8080/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar usuário");
      }

      const result = await response.json();
      alert("Usuário cadastrado com sucesso!");

      // Limpar campos
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setFullName("");
      setPhone("");

      // Redirecionar para login
      navigate("/login");
    } catch (error) {
      console.error("Erro no cadastro:", error);
      alert("Erro ao cadastrar. Tente novamente.");
    }
  };

  return (
    <AuthForm
      buttonText="Criar conta"
      alternateText="Já tem uma conta?"
      alternateLinkText="Entrar"
      onSubmit={handleRegister}
      buttonId="register-button"
      linkTo="/login"
      isDisabled={!isFormValid}
    >
      <h2>Selecione o tipo de conta</h2>

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

      {/* Nome completo */}
      <div className="input-container">
        <span className="material-symbols-outlined input-icon">person</span>
        <input
          id="fullName"
          type="text"
          placeholder=" "
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <label htmlFor="fullName">Nome Completo</label>
      </div>

      {/* Email */}
      <div className="input-container">
        <span className="material-symbols-outlined input-icon">mail</span>
        <input
          id="email"
          type="email"
          placeholder=" "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="email">Email</label>
        <div className="error">{emailError || "\u00A0"}</div>
      </div>

      {/* Telefone */}
      <div className="input-container">
        <span className="material-symbols-outlined input-icon">phone</span>
        <input
          id="phone"
          type="text"
          placeholder=" "
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <label htmlFor="phone">Telefone</label>
      </div>

      {/* CRM */}
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
        />
        <label htmlFor="crm">CRM</label>
      </div>

      {/* Senha */}
      <div className="input-container">
        <span className="material-symbols-outlined input-icon">lock</span>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder=" "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="password">Senha</label>
        <div className="error">{passwordError || "\u00A0"}</div>

        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="material-symbols-outlined"
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            userSelect: "none",
            fontSize: "24px",
          }}
          aria-label="Mostrar ou ocultar senha"
        >
          {showPassword ? "visibility" : "visibility_off"}
        </span>
      </div>

      {/* Confirmar Senha */}
      <div className="input-container">
        <span className="material-symbols-outlined input-icon">lock</span>
        <input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder=" "
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirmar Senha</label>
        <div className="error">{confirmPasswordError || "\u00A0"}</div>

        <span
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          className="material-symbols-outlined"
          style={{
            position: "absolute",
            top: "50%",
            right: "10px",
            transform: "translateY(-50%)",
            cursor: "pointer",
            userSelect: "none",
            fontSize: "24px",
          }}
          aria-label="Mostrar ou ocultar senha"
        >
          {showConfirmPassword ? "visibility" : "visibility_off"}
        </span>
      </div>
    </AuthForm>
  );
};

export default Register;
