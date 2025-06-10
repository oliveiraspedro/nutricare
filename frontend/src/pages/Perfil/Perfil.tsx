import "./Perfil.css";
import { use, useEffect, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaEdit,
  FaAppleAlt,
  FaWeight,
  FaRulerVertical,
  FaTape,
  FaCalendarAlt,
  FaStickyNote,
  FaHeartbeat,
} from "react-icons/fa";

interface DadosAntropometricos {
  peso: number | "";
  altura: number | "";
  circunferencia: number | "";
  dataAvaliacao: string;
  observacoes: string;
}

const Perfil = () => {
  const [email, setEmail] = useState("max@gmail.com");
  const [telefone, setTelefone] = useState("(11) 98372-04567");
  const [senha, setSenha] = useState("**********");
  const [userType, setUserType] = useState<string | null>("");

  useEffect(() => {
    const userType = localStorage.getItem("userType");
    if (userType) {
      setUserType(userType);
    }
  }, []);

  // Estados para dados antropométricos
  const [dadosAntropometricos, setDadosAntropometricos] =
    useState<DadosAntropometricos>({
      peso: 61.0,
      altura: 161,
      circunferencia: 60,
      dataAvaliacao: "03-06-2025",
      observacoes: "Paciente apresenta boa evolução no programa nutricional.",
    });

  const calcularIMC = () => {
    if (dadosAntropometricos.peso && dadosAntropometricos.altura) {
      const pesoNum = Number(dadosAntropometricos.peso);
      const alturaNum = Number(dadosAntropometricos.altura) / 100; // converter cm para metros
      const imc = pesoNum / (alturaNum * alturaNum);
      return imc.toFixed(1);
    }
    return null;
  };

  const getClassificacaoIMC = (imc: number) => {
    if (imc < 18.5) return "Abaixo do peso";
    if (imc < 25) return "Peso normal";
    if (imc < 30) return "Sobrepeso";
    return "Obesidade";
  };

  const imc = calcularIMC();

  return (
    <div className="profile-container">
      {/* Header */}
      <div className="profile-header">
        <span className="profile-icon">
          {FaAppleAlt({ className: "profile-icon" })}
        </span>
        <div>
          <h1>Meu Perfil</h1>
          <p>Informações pessoais</p>
        </div>
      </div>

      {/* Card Dados Pessoais */}
      <div className="profile-card">
        <div className="profile-user">
          <FaUserCircle className="user-avatar" />
          <h2>Max Maya</h2>
        </div>

        <div className="profile-grid">
          {/* Email */}
          <div className="input-grupo">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Telefone */}
          <div className="input-grupo">
            <label htmlFor="telefone">Telefone</label>
            <div className="input-wrapper">
              <FaPhone className="input-icon" />
              <input
                id="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
            </div>
          </div>

          {/* Senha */}
          <div className="input-grupo">
            <label htmlFor="senha">Senha</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" />
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Botão à esquerda */}
        <div className="edit-button-container left-align">
          <button className="edit-button">
            <FaEdit /> Editar
          </button>
        </div>
      </div>

      {/* Card Dados Antropométricos */}
      {userType === "paciente" && (
        <div className="profile-card antropometric-card">
          <div className="section-header">
            <FaHeartbeat className="section-icon" />
            <div>
              <h3>Dados Antropométricos</h3>
              <p>Última avaliação médica</p>
            </div>
          </div>

          {dadosAntropometricos.peso ? (
            <>
              <div className="antropometric-grid">
                {/* Peso */}
                <div className="input-grupo">
                  <label>Peso</label>
                  <div className="input-wrapper readonly">
                    <FaWeight className="input-icon" />
                    <input
                      type="text"
                      value={`${dadosAntropometricos.peso} kg`}
                      readOnly
                    />
                  </div>
                </div>

                {/* Altura */}
                <div className="input-grupo">
                  <label>Altura</label>
                  <div className="input-wrapper readonly">
                    <FaRulerVertical className="input-icon" />
                    <input
                      type="text"
                      value={`${dadosAntropometricos.altura} cm`}
                      readOnly
                    />
                  </div>
                </div>

                {/* Circunferência */}
                <div className="input-grupo">
                  <label>Circunferência da Cintura</label>
                  <div className="input-wrapper readonly">
                    <FaTape className="input-icon" />
                    <input
                      type="text"
                      value={`${dadosAntropometricos.circunferencia} cm`}
                      readOnly
                    />
                  </div>
                </div>

                {/* Data da Avaliação */}
                <div className="input-grupo">
                  <label>Data da Avaliação</label>
                  <div className="input-wrapper readonly">
                    <FaCalendarAlt className="input-icon" />
                    <input
                      type="text"
                      value={new Date(
                        dadosAntropometricos.dataAvaliacao
                      ).toLocaleDateString("pt-BR")}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* IMC Display */}
              {imc && (
                <div className="imc-display">
                  <div className="imc-info">
                    <span className="imc-label">IMC:</span>
                    <span className="imc-value">{imc}</span>
                    <span
                      className={`imc-classification ${getClassificacaoIMC(
                        Number(imc)
                      )
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {getClassificacaoIMC(Number(imc))}
                    </span>
                  </div>
                </div>
              )}

              {/* Observações */}
              {dadosAntropometricos.observacoes && (
                <div className="input-grupo observacoes-grupo">
                  <label>Observações Médicas</label>
                  <div className="input-wrapper textarea-wrapper readonly">
                    <FaStickyNote className="input-icon" />
                    <textarea
                      value={dadosAntropometricos.observacoes}
                      readOnly
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-data-message">
              <FaHeartbeat className="no-data-icon" />
              <p>Nenhuma avaliação antropométrica registrada</p>
              <span>
                Os dados serão exibidos após sua próxima consulta médica
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Perfil;
