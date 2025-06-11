import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/AuthForm/AuthForm";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const handleSend = () => {};

  const [emailError, setEmailError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    const emailValid = validateEmail(email);
    setEmailError(emailValid || email === "" ? "" : "Digite um e-mail válido.");
    setIsFormValid(emailValid);
  }, [email]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }
    // lógica de envio vai aqui
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="forgot-password-modal">
      <button 
        className="close-button" 
        onClick={handleGoBack}
        type="button"
        aria-label="Fechar"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <AuthForm
        buttonText="Enviar"
        alternateText=""
        alternateLinkText=""
        onSubmit={handleRegister}
        buttonId="send-button"
        linkTo=""
        isDisabled={false}
      >
        <h2>Esqueceu sua Senha?</h2>
        <p>Insira o e-mail cadastrado para recuperar a senha</p>
        <div className="input-container">
          <span className="input-icon material-symbols-outlined">mail</span>
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
      </AuthForm>
    </div>
  );
};

export default ForgotPassword;