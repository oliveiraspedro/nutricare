import React, { useState } from "react";
import "./ModalAdicionarPaciente.css";
import Button from "../../Button/Button";

interface ModalAdicionarPacienteProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string) => void;
}

const ModalAdicionarPaciente: React.FC<ModalAdicionarPacienteProps> = ({ isOpen, onClose, onAdd }) => {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setErro("Digite um e-mail.");
      return;
    }

    if (!validarEmail(email)) {
      setErro("Digite um e-mail válido.");
      return;
    }
    

    setErro("");
    onAdd(email);
    setEmail("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Adicionar Paciente</h2>
        <input
          type="email"
          placeholder="Digite o e-mail do paciente"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErro(""); // limpa erro enquanto digita
          }}
        />
        {erro && <p className="erro-texto">{erro}</p>}
        <div className="modal-buttons">
          <Button label="Cancelar" variant="secondary" size="medium" onClick={onClose} />
          <Button label="Adicionar" variant="primary" size="medium" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default ModalAdicionarPaciente;
