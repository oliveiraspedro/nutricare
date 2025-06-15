import React, { useState, useEffect } from "react";
import AuthForm from "../../components/AuthForm/AuthForm";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Login.css";
import medicoicon from "../../assets/img/image-doutor.png";
import pacienteicon from "../../assets/img/image-paciente.png";

interface JwtPayload {
  // Adicione as propriedades que você incluiu no seu payload
  id: number; // Ou string, dependendo do tipo do seu ID
  email: string;
  role: string;
  name?: string; // Opcional, se nem sempre estiver presente
  crm?: string; // Opcional, se nem sempre estiver presente (para médicos)
}

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

  // Função para formatar o CRM automaticamente
  const formatCRM = (value: string): string => {
    // Remove tudo que não for letra ou número
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "");

    // Aplica o formato XX-123456 (2 letras + hífen + 6 números)
    if (cleaned.length <= 2) {
      return cleaned.toUpperCase();
    } else if (cleaned.length <= 8) {
      const letters = cleaned.slice(0, 2).toUpperCase();
      const numbers = cleaned.slice(2);
      return `${letters}-${numbers}`;
    } else {
      // Limita a 8 caracteres no total (2 letras + 6 números)
      const letters = cleaned.slice(0, 2).toUpperCase();
      const numbers = cleaned.slice(2, 8);
      return `${letters}-${numbers}`;
    }
  };

  // Função para validar o CRM
  const validateCRM = (crmValue: string): string => {
    if (crmValue === "") return "";

    // Regex para validar formato XX-123456 (2 letras + hífen + 6 números)
    const crmRegex = /^[A-Z]{2}-\d{6}$/;

    if (!crmRegex.test(crmValue)) {
      if (crmValue.length < 9) {
        return "CRM deve ter o formato UF-000000";
      } else {
        return "Formato de CRM inválido. Use UF-000000";
      }
    }

    return "";
  };

  // Handler para mudança no input do CRM
  const handleCrmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCRM(e.target.value);
    setCrm(formattedValue);
  };

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (accountType === "medico") {
      const newMedico = {
        crm: crm,
        password: password,
      };

      try {
        const response = await fetch(`${API_BASE_URL}/api/login/medico`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMedico),
        });

        const result = await response.json();

        if (response.ok) {
          console.log("Login efetuado com sucesso:", result);
          if (result.token) {
            localStorage.setItem("token", result.token);

            try {
              const decodedToken = jwtDecode(result.token);

              localStorage.setItem("userType", "medico");
              localStorage.setItem("userId", decodedToken.medico.id.toString());
              localStorage.setItem("userName", decodedToken.medico.name || "");
              localStorage.setItem("crm", decodedToken.medico.crm || "");

              navigate(`/pacientes/${localStorage.getItem("userId")}`);
            } catch (decodeError) {
              console.error("Erro ao decodificar o token:", decodeError);
              console.log(
                "Erro ao processar o token de autenticação. Tente novamente."
              );
              // Opcional: Limpar o token inválido
              localStorage.removeItem("token");
            }
          } else {
            console.log(result.message || "Token não recebido.");
          }
        } else {
          console.log(
            result.message || "Erro no login. Verifique suas credenciais."
          );
        }
      } catch (error) {
        console.error("Erro no cadastro:", error);
        alert("Erro ao cadastrar. Tente novamente.");
      }
    } else {
      const newPaciente = {
        email: email,
        password: password,
      };

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/login/paciente`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newPaciente),
          }
        );

        const result = await response.json();

        if (response.ok) {
          console.log("Login efetuado com sucesso:", result);
          if (result.token) {
            localStorage.setItem("token", result.token);
            localStorage.setItem("userType", "paciente");
            localStorage.setItem("email", result.token.email);
            navigate("/perfil");
          }
        } else {
          console.error("Erro ao efetuar login", result);
          alert(result.message || "Erro ao efetuar login. Tente novamente.");
          return;
        }

        setEmail("");
        setPassword("");

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
    let crmValido = true;
    if (accountType === "medico") {
      crmFilled = crm.trim() !== "";
      crmValido = validateCRM(crm) === "";

      if (crm === "") {
        setCrmError("");
      } else if (!crmFilled) {
        setCrmError("O CRM é obrigatório para médicos.");
      } else {
        setCrmError(validateCRM(crm));
      }
    } else {
      setCrmError("");
    }

    setPasswordError(
      senhaValida || password === ""
        ? ""
        : "A senha deve ter pelo menos 8 caracteres."
    );

    let formIsValid = emailValido && senhaValida;

    if (accountType === "medico") {
      formIsValid = crmFilled && crmValido && senhaValida;
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
            onChange={handleCrmChange}
            required
            autoComplete="off"
            maxLength={9}
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
