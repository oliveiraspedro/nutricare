import React from "react";
import "./ModalConfirmarExclusao.css";
import Button from "../../Button/Button";

interface ModalConfirmarExclusaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nome?: string;
}

const ModalConfirmarExclusao: React.FC<ModalConfirmarExclusaoProps> = ({ isOpen, onClose, onConfirm, nome }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Confirmar Exclusão</h2>
        <p>Tem certeza que deseja excluir {nome ? `o paciente "${nome}"` : "este item"}?</p>
        <div className="modal-buttons">
          <Button label="Cancelar" variant="secondary" size="medium" onClick={onClose} />
          <Button label="Excluir" variant="danger" size="medium" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarExclusao;
