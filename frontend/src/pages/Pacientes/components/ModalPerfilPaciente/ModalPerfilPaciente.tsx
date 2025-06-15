import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ModalPerfilPaciente.module.css";
import Button from "../../../../components/Button/Button";
import { User, X, Edit, Save, Utensils, BarChart4, Eye } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface DadosAntropometricos {
    peso: number | "";
    altura: number | "";
    circunferencia: number | "";
    dataAvaliacao: string;
    observacoes: string;
}

// Interface do Paciente com o campo 'id' adicionado
interface Paciente {
    id: number; // <-- CORREÇÃO: Propriedade 'id' adicionada
    name: string;
    email: string;
    phone: string;
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
    paciente,
}) => {
    const navigate = useNavigate();
    const [modoEdicao, setModoEdicao] = useState(false);
    const [dadosAntropometricos, setDadosAntropometricos] =
        useState<DadosAntropometricos>({
            peso: "",
            altura: "",
            circunferencia: "",
            dataAvaliacao: new Date().toISOString().split("T")[0],
            observacoes: "",
        });

    useEffect(() => {
        if (paciente) {
            setDadosAntropometricos({
                peso: paciente.avaliacaoAtual?.peso || "",
                altura: paciente.avaliacaoAtual?.altura || "",
                circunferencia: paciente.avaliacaoAtual?.circunferencia || "",
                dataAvaliacao:
                    paciente.avaliacaoAtual?.dataAvaliacao ||
                    new Date().toISOString().split("T")[0],
                observacoes: paciente.avaliacaoAtual?.observacoes || "",
            });
            setModoEdicao(false);
        }
    }, [paciente]);

    if (!isOpen || !paciente) return null;

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setDadosAntropometricos((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const calcularIMC = () => {
        const pesoNum = Number(dadosAntropometricos.peso);
        const alturaNum = Number(dadosAntropometricos.altura);
        if (pesoNum > 0 && alturaNum > 0) {
            const alturaMetros = alturaNum / 100;
            const imc = pesoNum / (alturaMetros * alturaMetros);
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

    // Função para guardar a avaliação no backend
    const handleSalvarAvaliacao = async () => {
        if (!paciente) return;
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/api/avaliacoes/${paciente.id}`, { 
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(dadosAntropometricos)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Falha ao guardar a avaliação.");
            }

            alert("Avaliação guardada com sucesso!");
            setModoEdicao(false);
            // Opcional: pode chamar onClose() para fechar o modal ou uma função para atualizar os dados na página de Pacientes
            
        } catch (error) {
            console.error("Erro ao guardar avaliação:", error);
            alert(`Erro: ${(error as Error).message}`);
        }
    };

    const handleAddOrManagePlan = () => {
        if (!paciente || !paciente.email) {
            alert("Erro: Dados do paciente não disponíveis.");
            return;
        }
        navigate(`/plano-alimentar/${paciente.email}`);
        onClose(); 
    };

    const imc = calcularIMC();
    
    // Função para formatar a data de nascimento de forma segura
    const getSafeDateValue = (dateString: string | null | undefined) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '';
        }
        return date.toISOString().split('T')[0];
    }

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <header className={styles.modalHeader}>
                    <User size={24} />
                    <h2>Perfil do Paciente</h2>
                </header>
                <section className={styles.formGrid}>
                    <div className={styles.formGroup}><label>Nome completo</label><input type="text" value={paciente.name} disabled /></div>
                    <div className={styles.formGroup}><label>E-mail</label><input type="email" value={paciente.email} disabled /></div>
                    <div className={styles.formGroup}><label>Telefone</label><input type="text" value={paciente.phone} disabled /></div>
                    <div className={styles.formGroup}>
                        <label>Data de nascimento</label>
                        <input type="date" value={getSafeDateValue(paciente.dataNascimento)} disabled />
                    </div>
                </section>
                <div className={styles.sectionDivider}>
                    <BarChart4 size={20} />
                    <h3>Dados Antropométricos</h3>
                    <button className={styles.editButton} onClick={() => setModoEdicao(!modoEdicao)}>
                        {modoEdicao ? <Eye size={16} /> : <Edit size={16} />}
                        {modoEdicao ? "Visualizar" : "Editar"}
                    </button>
                </div>
                <section className={styles.antropometricoContainer}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}><label>Peso (kg)</label><input name="peso" type="number" step="0.1" value={dadosAntropometricos.peso} onChange={handleInputChange} disabled={!modoEdicao} placeholder="Ex: 75.5" /></div>
                        <div className={styles.formGroup}><label>Altura (cm)</label><input name="altura" type="number" value={dadosAntropometricos.altura} onChange={handleInputChange} disabled={!modoEdicao} placeholder="Ex: 170" /></div>
                        <div className={styles.formGroup}><label>Circunferência da Cintura (cm)</label><input name="circunferencia" type="number" step="0.1" value={dadosAntropometricos.circunferencia} onChange={handleInputChange} disabled={!modoEdicao} placeholder="Ex: 85" /></div>
                        <div className={styles.formGroup}><label>Data da Avaliação</label><input name="dataAvaliacao" type="date" value={dadosAntropometricos.dataAvaliacao} onChange={handleInputChange} disabled={!modoEdicao} /></div>
                    </div>
                    {imc && (<div className={styles.imcDisplay}><p className={styles.imcValue}>IMC: {imc}</p><span className={styles.imcClassification}>{getClassificacaoIMC(Number(imc))}</span></div>)}
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                        <label>Observações</label>
                        <textarea name="observacoes" value={dadosAntropometricos.observacoes} onChange={handleInputChange} disabled={!modoEdicao} placeholder="Observações sobre a avaliação do paciente..." rows={3} />
                    </div>
                </section>
                <footer className={styles.actionButtons}>
                    {modoEdicao ? (
                        <Button label="Guardar Avaliação" variant="primary" size="medium" icon={<Save size={16} />} onClick={handleSalvarAvaliacao} />
                    ) : (
                        <Button label="Plano Alimentar" variant="primary" size="medium" icon={<Utensils size={16} />} onClick={handleAddOrManagePlan} />
                    )}
                </footer>
            </div>
        </div>
    );
};

export default ModalPerfilPaciente;