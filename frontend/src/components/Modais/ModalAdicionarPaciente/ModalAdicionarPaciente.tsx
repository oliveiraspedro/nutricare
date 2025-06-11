import React, { useState } from "react";
import styles from "./ModalAdicionarPaciente.module.css";
import Button from "../../Button/Button";
import { UserPlus, X } from "lucide-react";

interface ModalAdicionarPacienteProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string) => void;
}

const ModalAdicionarPaciente: React.FC<ModalAdicionarPacienteProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState("");

  const validarEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setErro("O campo de e-mail é obrigatório.");
      return;
    }
    if (!validarEmail(email)) {
      setErro("Por favor, digite um e-mail válido.");
      return;
    }

    setErro("");
    onAdd(email);
    setEmail(""); // Limpa o campo após o sucesso
    onClose();
  };

  const handleClose = () => {
    setEmail(""); // Limpa o estado ao fechar
    setErro("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose}>
          <X size={24} />
        </button>

        <header className={styles.modalHeader}>
          <UserPlus size={24} />
          <h2>Adicionar Paciente</h2>
        </header>

        <div className={styles.content}>
          <p className={styles.instructions}>
            Digite o e-mail do paciente que você deseja adicionar à sua lista. O paciente receberá uma notificação para confirmar.
          </p>
          <div className={styles.formGroup}>
            <label htmlFor="email-paciente">E-mail do paciente</label>
            <input
              id="email-paciente"
              type="email"
              placeholder="nome@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (erro) setErro(""); // limpa erro enquanto digita
              }}
            />
            {erro && <p className={styles.erroTexto}>{erro}</p>}
          </div>
        </div>

        <footer className={styles.modalActions}>
          <Button
            label="Cancelar"
            variant="secondary"
            size="medium"
            onClick={handleClose}
          />
          <Button
            label="Adicionar"
            variant="primary"
            size="medium"
            onClick={handleSubmit}
          />
        </footer>
      </div>
    </div>
  );
};

export default ModalAdicionarPaciente;