import React from "react";
import "./ModalPerfilPaciente.css";
import Button from "../../../components/Button/Button";

interface Paciente {
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
}

interface ModalPerfilPacienteProps {
  isOpen: boolean;
  onClose: () => void;
  paciente: Paciente | null;
}

const ModalPerfilPaciente: React.FC<ModalPerfilPacienteProps> = ({ isOpen, onClose, paciente }) => {
  if (!isOpen || !paciente) return null;

  return (
    <div className="modal-overlay">
      <div className="modal perfil-modal">
        <button className="fechar-x" onClick={onClose}>×</button>

        <h2 className="modal-title">
          <span className="material-symbols-outlined">person</span>
          Perfil do Paciente
        </h2>

        <div className="perfil-form">
          <div className="input-group">
            <label>Nome completo</label>
            <input type="text" value={paciente.nome} disabled />
          </div>
          <div className="input-group">
            <label>E-mail</label>
            <input type="email" value={paciente.email} disabled />
          </div>
          <div className="input-group">
            <label>Telefone</label>
            <input type="text" value={paciente.telefone} disabled />
          </div>
          <div className="input-group">
            <label>Data de nascimento</label>
            <input type="text" value={paciente.dataNascimento} disabled />
          </div>
        </div>

        <div className="modal-buttons-vertical">
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
