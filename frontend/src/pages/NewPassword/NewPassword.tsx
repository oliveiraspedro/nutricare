import React, { useState, useEffect } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import "./NewPassword.css";

// Componente
const NewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const validatePassword = (password: string): boolean => password.length >= 6;

  useEffect(() => {
    const passwordValid = validatePassword(password);
    const passwordsMatch = password === confirmPassword;

    setPasswordError(
      passwordValid || password === ""
        ? ""
        : "A senha deve ter pelo menos 6 caracteres."
    );
    setConfirmPasswordError(
      passwordsMatch || confirmPassword === "" ? "" : "As senhas não coincidem."
    );

    setIsFormValid(passwordValid && passwordsMatch);
  }, [password, confirmPassword]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    // Lógica de envio vai aqui
  };

  return (
    <AuthForm
      buttonText="Redefinir"
      alternateText=""
      alternateLinkText=""
      onSubmit={handleRegister}
      buttonId="send-button"
      linkTo=""
      isDisabled={false}
    >
      <h2>Nova Senha</h2>
      <p>Insira sua nova senha </p>

      {/* Senha */}
      <div className="input-container">
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder=" "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="password">Nova Senha</label>
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
        <input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          placeholder=" "
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
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

export default NewPassword;