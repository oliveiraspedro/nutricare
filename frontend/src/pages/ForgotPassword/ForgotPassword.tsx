import React, { useState, useEffect } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  // Estados dos campos
  const [email, setEmail] = useState("");
  const handleSend = () => {};

  // Validação
  const [emailError, setEmailError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // Função de validação
  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Validações em tempo real
  useEffect(() => {
    const emailValid = validateEmail(email);
    setEmailError(emailValid || email === "" ? "" : "Digite um e-mail válido.");
    setIsFormValid(emailValid);
  }, [email]);

  // Enviar cadastro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    // lógica de envio vai aqui
  };

  return (
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
  );
};

export default ForgotPassword;
