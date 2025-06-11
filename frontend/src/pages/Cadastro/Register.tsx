import React, { useState, useEffect } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import medicoicon from "../../assets/img/image-doutor.png";
import pacienteicon from "../../assets/img/image-paciente.png";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [crm, setCrm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  type AccountUser = "medico" | "paciente";
  const [accountType, setAccountType] = useState<AccountUser>("medico");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [crmError, setCrmError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  
  const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password: string): boolean => password.length >= 6;
  const formatPhone = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) { return cleaned; }
    else if (cleaned.length <= 7) { return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`; }
    else if (cleaned.length <= 11) { return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`; }
    else { return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`; }
  };
  const validatePhone = (phoneValue: string): string => {
    if (phoneValue === "") return "";
    const numbersOnly = phoneValue.replace(/\D/g, '');
    if (numbersOnly.length < 10) { return "Telefone deve ter pelo menos 10 dígitos"; }
    else if (numbersOnly.length > 11) { return "Telefone deve ter no máximo 11 dígitos"; }
    const ddd = parseInt(numbersOnly.slice(0, 2));
    if (ddd < 11 || ddd > 99) { return "DDD inválido"; }
    return "";
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhone(e.target.value);
    setPhone(formattedValue);
  };
  const formatCRM = (value: string): string => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '');
    if (cleaned.length <= 2) { return cleaned.toUpperCase(); }
    else if (cleaned.length <= 8) {
      const letters = cleaned.slice(0, 2).toUpperCase();
      const numbers = cleaned.slice(2);
      return `${letters}-${numbers}`;
    } else {
      const letters = cleaned.slice(0, 2).toUpperCase();
      const numbers = cleaned.slice(2, 8);
      return `${letters}-${numbers}`;
    }
  };
  const validateCRM = (crmValue: string): string => {
    if (crmValue === "") return "";
    const crmRegex = /^[A-Z]{2}-\d{6}$/;
    if (!crmRegex.test(crmValue)) {
      if (crmValue.length < 9) { return "CRM deve ter o formato UF-000000"; }
      else { return "Formato de CRM inválido. Use UF-000000"; }
    }
    return "";
  };
  const handleCrmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCRM(e.target.value);
    setCrm(formattedValue);
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... sua lógica de registro
  };

  useEffect(() => {
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const passwordsMatch = password === confirmPassword;
    const fullNameFilled = fullName.trim() !== "";
    const phoneValid = validatePhone(phone) === "";
    const phoneFilled = phone.trim() !== "";
    let crmFilled = true;
    let crmValido = true;
    if (accountType === "medico") {
      crmFilled = crm.trim() !== "";
      crmValido = validateCRM(crm) === "";
    }
    let formIsValid = emailValid && passwordValid && passwordsMatch && fullNameFilled && phoneFilled && phoneValid;
    if (accountType === "medico") {
      formIsValid = formIsValid && crmFilled && crmValido;
    }
    setIsFormValid(formIsValid);
  }, [email, password, confirmPassword, fullName, phone, crm, accountType]);

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
        <div onClick={() => setAccountType("medico")} className={accountType === "medico" ? "tipo ativo" : "tipo"}>
          <img src={medicoicon} alt="Médico" />
          <span>Médico</span>
        </div>
        <div onClick={() => setAccountType("paciente")} className={accountType === "paciente" ? "tipo ativo" : "tipo"}>
          <img src={pacienteicon} alt="Paciente" />
          <span>Paciente</span>
        </div>
      </div>
      <div className="input-container">
        <span className="material-symbols-outlined input-icon">person</span>
        <input id="fullName" type="text" placeholder=" " value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <label htmlFor="fullName">Nome Completo</label>
      </div>
      <div className="input-container">
        <span className="material-symbols-outlined input-icon">mail</span>
        <input id="email" type="email" placeholder=" " value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label htmlFor="email">Email</label>
        <div className="error">{emailError || "\u00A0"}</div>
      </div>
      <div className="input-container">
        <span className="material-symbols-outlined input-icon">phone</span>
        <input id="phone" type="text" placeholder=" " value={phone} onChange={handlePhoneChange} required maxLength={15} />
        <label htmlFor="phone">Telefone</label>
        <div className="error">{phoneError || "\u00A0"}</div>
      </div>
      {accountType === "medico" && (
        <div className="input-container">
          <span className="material-symbols-outlined input-icon">badge</span>
          <input id="crm" type="text" placeholder=" " value={crm} onChange={handleCrmChange} required autoComplete="off" maxLength={9} />
          <label htmlFor="crm">CRM</label>
          <div className="error">{crmError || "\u00A0"}</div>
        </div>
      )}
      <div className="input-container">
        <span className="material-symbols-outlined input-icon">lock</span>
        <input id="password" type={showPassword ? "text" : "password"} placeholder=" " value={password} onChange={(e) => setPassword(e.target.value)} required />
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
      <div className="input-container">
        <span className="material-symbols-outlined input-icon">lock</span>
        <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder=" " value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
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