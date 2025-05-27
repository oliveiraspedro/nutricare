import React, { useState } from "react";
import "./Pacientes.css";

import ModalAdicionarPaciente from "../../components/Modais/ModalAdicionarPaciente";
import ModalConfirmarExclusao from "../../components/Modais/ModalConfirmarExclusao";
import ModalPerfilPaciente from "../../components/Modais/ModalPerfilPaciente";

import Button from "../../components/Button/Button";

interface Paciente {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
}

const Pacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([
    {
      id: 1,
      nome: "Max Maya",
      email: "max@example.com",
      telefone: "11 91234-5678",
      dataNascimento: "1990-01-15",
    },
    {
      id: 2,
      nome: "Pedro Silva",
      email: "pedro@example.com",
      telefone: "21 99876-5432",
      dataNascimento: "1985-07-08",
    },
    {
      id: 3,
      nome: "Carlos Mendes",
      email: "carlos@example.com",
      telefone: "31 98765-4321",
      dataNascimento: "1978-05-23",
    },
    {
      id: 4,
      nome: "Márcio Almeida",
      email: "marcio@example.com",
      telefone: "41 99999-0000",
      dataNascimento: "1992-12-02",
    },
  ]);

  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<Paciente | null>(null);
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);

  const handleAbrirModalAdicionar = () => setModalAdicionarAberto(true);
  const handleFecharModalAdicionar = () => setModalAdicionarAberto(false);

  const handleAdicionarPaciente = (email: string) => {
    const novoPaciente: Paciente = {
      id: pacientes.length + 1,
      nome: email, // por enquanto usamos o email como nome
      email,
      telefone: "Não informado",
      dataNascimento: "Não informado",
    };
    setPacientes([...pacientes, novoPaciente]);
  };

  const handleAbrirModalExcluir = (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setModalExcluirAberto(true);
  };

  const handleConfirmarExclusao = () => {
    if (pacienteSelecionado) {
      setPacientes(pacientes.filter((p) => p.id !== pacienteSelecionado.id));
    }
    setModalExcluirAberto(false);
    setPacienteSelecionado(null);
  };

  const handleAbrirPerfilPaciente = (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setModalPerfilAberto(true);
  };

  const handleFecharModalPerfil = () => {
    setPacienteSelecionado(null);
    setModalPerfilAberto(false);
  };

  return (
    <div className="seus-pacientes-container">
      <div className="seus-pacientes-header">
        <p>Seus Pacientes</p>
        <button
          className="add-paciente-button"
          onClick={handleAbrirModalAdicionar}
        >
          <span
            className="material-symbols-outlined"
            style={{ color: "white" }}
          >
            person_add{" "}
          </span>
          Adicionar Paciente
        </button>
      </div>

      <div className="paciente-list">
        {pacientes.map((paciente) => (
          <div
            key={paciente.id}
            className="paciente-card"
            onClick={() => handleAbrirPerfilPaciente(paciente)}
          >
            <div className="paciente-info">
              <span
                className="material-symbols-outlined"
                style={{ color: "white" }}
              >
                account_circle
              </span>
              <span className="paciente-nome">{paciente.nome}</span>
            </div>

            <Button
              label=""
              variant="danger"
              icon={<span className="material-symbols-outlined">delete</span>}
              onClick={(e) => {
                e.stopPropagation();
                handleAbrirModalExcluir(paciente);
              }}
            />
          </div>
        ))}
      </div>

      {/* Modal: Adicionar Paciente */}
      <ModalAdicionarPaciente
        isOpen={modalAdicionarAberto}
        onClose={handleFecharModalAdicionar}
        onAdd={handleAdicionarPaciente}
      />

      {/* Modal: Confirmar Exclusão */}
      <ModalConfirmarExclusao
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={handleConfirmarExclusao}
        nome={pacienteSelecionado?.nome}
      />

      {/* Modal: Perfil do Paciente */}
      <ModalPerfilPaciente
        isOpen={modalPerfilAberto}
        onClose={handleFecharModalPerfil}
        paciente={pacienteSelecionado}
      />
    </div>
  );
};

export default Pacientes;
