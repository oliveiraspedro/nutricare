import React, { useEffect, useState } from "react";
import "./Pacientes.css";

import ModalAdicionarPaciente from "./components/ModalAdicionarPaciente/ModalAdicionarPaciente";
import ModalConfirmarExclusao from "./components/ModalConfirmarExclusao/ModalConfirmarExclusao";
import ModalPerfilPaciente from "./components/ModalPerfilPaciente/ModalPerfilPaciente";
import Button from "../../components/Button/Button";

interface Paciente {
  id: number;
  name: string;
  email: string;
  phone: string;
  dataNascimento: string;
  // Opcional, para que possamos adicionar os dados da avaliação aqui
  avaliacaoAtual?: any; 
}

const Pacientes: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);

  const handleAbrirModalAdicionar = () => setModalAdicionarAberto(true);
  const handleFecharModalAdicionar = () => setModalAdicionarAberto(false);

  // Busca a lista de pacientes do médico quando o componente é montado
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/medico/pacientes/${localStorage.getItem("userId")}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Erro ao buscar pacientes");
        }  
        // Mapeia os dados, garantindo que os campos correspondem à interface
        const fetchedPacientes: Paciente[] = result.pacientes.map(
          (paciente: any) => ({
            id: paciente.id,
            name: paciente.name,
            email: paciente.email,
            phone: paciente.phone,
            dataNascimento: paciente.dataNascimento || "Não informado", // Adiciona um fallback
          })
        );
        setPacientes(fetchedPacientes);
      } catch (error) {
        console.error("Erro ao buscar todos os pacientes associados com nutricionista:", error);
      }
    };
    fetchData();
  }, []);

  const handleAdicionarPaciente = async (email: string) => {
    try {
      console.log("Adicionando paciente com email:", email);
      const response = await fetch(
        `${API_BASE_URL}/api/medico/pacientes/assignPaciente`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            email,
            medicoId: localStorage.getItem("userId"),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao adicionar paciente");
      }

      // Atualiza a lista de pacientes após adicionar um novo
      const novoPaciente: Paciente = {
        id: result.paciente.id, // Usa o ID real vindo do backend
        name: result.paciente.name,
        email: result.paciente.email,
        phone: result.paciente.phone,
        dataNascimento: result.paciente.dataNascimento || "Não informado",
      };
      setPacientes([...pacientes, novoPaciente]);
      handleFecharModalAdicionar(); // Fecha o modal após o sucesso
    } catch (error) {
      console.error("Erro ao adicionar paciente:", error);
      alert((error as Error).message);
    }
  };

  const handleAbrirModalExcluir = (paciente: Paciente) => {
    setPacienteSelecionado(paciente);
    setModalExcluirAberto(true);
  };

  const handleConfirmarExclusao = async () => {
    if (!pacienteSelecionado) return;
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/medico/pacientes/deassignPaciente`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            medicoId: localStorage.getItem("userId"),
            pacienteId: pacienteSelecionado.id, // Enviar o ID do paciente a ser desvinculado
          }),
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Erro ao desassociar paciente");
      }

      setPacientes(pacientes.filter((p) => p.id !== pacienteSelecionado.id));
      console.log("Paciente desassociado com sucesso");
    } catch (error) {
      console.error("Erro ao excluir paciente:", error);
      alert((error as Error).message);
    }
    setModalExcluirAberto(false);
    setPacienteSelecionado(null);
  };

  // Lógica atualizada para buscar a avaliação antes de abrir o modal
  const handleAbrirPerfilPaciente = async (paciente: Paciente) => {
    try {
        console.log(`A buscar avaliação para ${paciente.name}...`);
        
        setPacienteSelecionado(paciente);
        setModalPerfilAberto(true); 

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/avaliacoes/${paciente.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            console.warn(`Nenhuma avaliação encontrada para o paciente com ID: ${paciente.id}`);
            // Neste caso, o modal já está aberto com os dados básicos, não há problema.
            return; 
        }

        const dadosAvaliacao = await response.json();

        // Combina os dados básicos do paciente com a avaliação
        const pacienteCompleto = {
            ...paciente,
            avaliacaoAtual: dadosAvaliacao
        };

        // Atualiza o estado, o que irá re-renderizar o modal com a avaliação
        setPacienteSelecionado(pacienteCompleto);

    } catch (error) {
        console.error("Erro ao buscar avaliação do paciente:", error);
    }
  };

  const handleFecharModalPerfil = () => {
    setPacienteSelecionado(null);
    setModalPerfilAberto(false);
  };

  return (
    <div className="seus-pacientes-container">
      <div className="seus-pacientes-header">
        <p>Seus Pacientes</p>
        <button className="add-paciente-button" onClick={handleAbrirModalAdicionar}>
          <span className="material-symbols-outlined" style={{ color: "white" }}>person_add</span>
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
              <span className="material-symbols-outlined" style={{ color: "white" }}>account_circle</span>
              <span className="paciente-nome">{paciente.name}</span>
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

      <ModalAdicionarPaciente
        isOpen={modalAdicionarAberto}
        onClose={handleFecharModalAdicionar}
        onAdd={handleAdicionarPaciente}
      />
      <ModalConfirmarExclusao
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={handleConfirmarExclusao}
        nome={pacienteSelecionado?.name}
      />
      <ModalPerfilPaciente
        isOpen={modalPerfilAberto}
        onClose={handleFecharModalPerfil}
        paciente={pacienteSelecionado}
      />
    </div>
  );
};

export default Pacientes;
