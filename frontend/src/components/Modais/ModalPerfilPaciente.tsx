import React, { useState } from "react";
import "./ModalPerfilPaciente.css";
import Button from "../Button/Button";

interface DadosAntropometricos {
  peso: number | "";
  altura: number | "";
  circunferencia: number | "";
  dataAvaliacao: string;
  observacoes: string;
}

interface Paciente {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  avaliacaoAtual?: DadosAntropometricos;
}

interface ModalPerfilPacienteProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
}

const ModalPerfilPaciente: React.FC<ModalPerfilPacienteProps> = ({ 
  isOpen, 
  onClose, 
  paciente 
}) => {
  const [dadosAntropometricos, setDadosAntropometricos] = useState<DadosAntropometricos>({
    peso: paciente?.avaliacaoAtual?.peso || "",
    altura: paciente?.avaliacaoAtual?.altura || "",
    circunferencia: paciente?.avaliacaoAtual?.circunferencia || "",
    dataAvaliacao: paciente?.avaliacaoAtual?.dataAvaliacao || new Date().toISOString().split('T')[0],
    observacoes: paciente?.avaliacaoAtual?.observacoes || ""
  });

  const [modoEdicao, setModoEdicao] = useState(false);

  if (!isOpen || !paciente) return null;

  const handleInputChange = (field: keyof DadosAntropometricos, value: string | number) => {
    setDadosAntropometricos(prev => ({
      ...prev,
      [field]: value
    }));
  };

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

  const handleSalvarAvaliacao = () => {
    // Aqui faria a chamada para API para salvar os dados
    console.log("Salvando avaliação:", dadosAntropometricos);
    alert("Avaliação salva com sucesso!");
    setModoEdicao(false);
  };

  const imc = calcularIMC();

  return (
    <div className="modal-overlay">
      <div className="modal perfil-modal">
        <button className="fechar-x" onClick={onClose}>×</button>

        <h2 className="modal-title">
          <span className="material-symbols-outlined">person</span>
          Perfil do Paciente
        </h2>

        {/* Dados Pessoais */}
        <div className="perfil-form">
          <div className="input-row">
            <div className="input-group">
              <label>Nome completo</label>
              <input type="text" value={paciente.nome} disabled />
            </div>
            <div className="input-group">
              <label>E-mail</label>
              <input type="email" value={paciente.email} disabled />
            </div>
          </div>
          <div className="input-row">
            <div className="input-group">
              <label>Telefone</label>
              <input type="text" value={paciente.telefone} disabled />
            </div>
            <div className="input-group">
              <label>Data de nascimento</label>
              <input type="text" value={paciente.dataNascimento} disabled />
            </div>
          </div>
        </div>

        {/* Divisor */}
        <div className="section-divider">
          <span className="material-symbols-outlined">monitoring</span>
          <h3>Dados Antropométricos</h3>
          <button 
            className="btn-editar-avaliacao"
            onClick={() => setModoEdicao(!modoEdicao)}
          >
            <span className="material-symbols-outlined">
              {modoEdicao ? "visibility" : "edit"}
            </span>
            {modoEdicao ? "Visualizar" : "Editar"}
          </button>
        </div>

        {/* Dados Antropométricos */}
        <div className="antropometrico-form">
          <div className="input-row">
            <div className="input-group">
              <label>Peso (kg)</label>
              <input 
                type="number" 
                step="0.1"
                value={dadosAntropometricos.peso}
                onChange={(e) => handleInputChange("peso", e.target.value)}
                disabled={!modoEdicao}
                placeholder="Ex: 75.5"
              />
            </div>
            <div className="input-group">
              <label>Altura (cm)</label>
              <input 
                type="number" 
                value={dadosAntropometricos.altura}
                onChange={(e) => handleInputChange("altura", e.target.value)}
                disabled={!modoEdicao}
                placeholder="Ex: 170"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Circunferência da Cintura (cm)</label>
              <input 
                type="number" 
                step="0.1"
                value={dadosAntropometricos.circunferencia}
                onChange={(e) => handleInputChange("circunferencia", e.target.value)}
                disabled={!modoEdicao}
                placeholder="Ex: 85"
              />
            </div>
            <div className="input-group">
              <label>Data da Avaliação</label>
              <input 
                type="date" 
                value={dadosAntropometricos.dataAvaliacao}
                onChange={(e) => handleInputChange("dataAvaliacao", e.target.value)}
                disabled={!modoEdicao}
              />
            </div>
          </div>

          {/* IMC Calculado */}
          {imc && (
            <div className="imc-display">
              <div className="imc-valor">
                <span className="imc-numero">IMC: {imc}</span>
                <span className="imc-classificacao">
                  {getClassificacaoIMC(Number(imc))}
                </span>
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Observações</label>
            <textarea 
              value={dadosAntropometricos.observacoes}
              onChange={(e) => handleInputChange("observacoes", e.target.value)}
              disabled={!modoEdicao}
              placeholder="Observações sobre a avaliação do paciente..."
              rows={3}
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="modal-buttons-vertical">
          {modoEdicao && (
            <Button
              label="Salvar Avaliação"
              
              size="medium"
              icon={<span className="material-symbols-outlined">save</span>}
              onClick={handleSalvarAvaliacao}
            />
          )}
          
          <Button
            label="Adicionar Planejamento"
            variant="primary"
            size="medium"
            icon={<span className="material-symbols-outlined">add</span>}
            onClick={() => alert("Adicionar planejamento")}
          />
          
          <Button
            label="Gerenciar Planejamento"
            variant="secondary"
            size="medium"
            icon={<span className="material-symbols-outlined">edit</span>}
            onClick={() => alert("Gerenciar planejamento")}
          />
        </div>
      </div>
    </div>
  );
};

export default ModalPerfilPaciente;
