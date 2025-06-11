import React from 'react';
import styles from './AnthropometricDataCard.module.css';
import { FaWeight, FaRulerVertical, FaTape, FaCalendarAlt, FaStickyNote, FaHeartbeat } from "react-icons/fa";

interface DadosAntropometricos {
    peso: number | "";
    altura: number | "";
    circunferencia: number | "";
    dataAvaliacao: string;
    observacoes: string;
}

interface Props {
    data: DadosAntropometricos | null;
}

// Funções de cálculo movidas para fora para não serem recriadas
const calcularIMC = (peso: number, altura: number) => {
    if (peso && altura) {
        const alturaEmMetros = altura / 100;
        const imc = peso / (alturaEmMetros * alturaEmMetros);
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

export const AnthropometricDataCard = ({ data }: Props) => {
    if (!data || !data.peso) {
        return (
            <div className={`${styles.profileCard} ${styles.noDataCard}`}>
                <FaHeartbeat className={styles.noDataIcon} />
                <p className={styles.noDataText}>Nenhuma avaliação antropométrica registrada</p>
                <span className={styles.noDataSubText}>Os dados serão exibidos após sua próxima consulta médica.</span>
            </div>
        );
    }

    const imc = calcularIMC(Number(data.peso), Number(data.altura));
    const imcValue = imc ? parseFloat(imc) : 0;

    return (
        <div className={styles.profileCard}>
            <div className={styles.sectionHeader}>
                <FaHeartbeat className={styles.sectionIcon} />
                <div>
                    <h3>Dados Antropométricos</h3>
                    <p>Última avaliação médica</p>
                </div>
            </div>

            <div className={styles.grid}>
                <div className={styles.inputGroup}>
                    <label>Peso</label>
                    <div className={styles.inputWrapper}>
                        <FaWeight className={styles.inputIcon} />
                        <input type="text" value={`${data.peso} kg`} readOnly />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Altura</label>
                    <div className={styles.inputWrapper}>
                        <FaRulerVertical className={styles.inputIcon} />
                        <input type="text" value={`${data.altura} cm`} readOnly />
                    </div>
                </div>
            </div>

            {imc && (
                <div className={styles.imcDisplay}>
                    <div className={styles.imcInfo}>
                        <span className={styles.imcLabel}>IMC:</span>
                        <span className={styles.imcValue}>{imc}</span>
                        <span className={`${styles.imcClassification} ${styles[getClassificacaoIMC(imcValue).toLowerCase().replace(/\s+/g, "-")]}`}>
                            {getClassificacaoIMC(imcValue)}
                        </span>
                    </div>
                </div>
            )}
            
            <div className={styles.grid}>
                <div className={styles.inputGroup}>
                    <label>Circunferência da Cintura</label>
                    <div className={styles.inputWrapper}>
                        <FaTape className={styles.inputIcon} />
                        <input type="text" value={`${data.circunferencia} cm`} readOnly />
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label>Data da Avaliação</label>
                    <div className={styles.inputWrapper}>
                        <FaCalendarAlt className={styles.inputIcon} />
                        <input type="text" value={new Date(data.dataAvaliacao).toLocaleDateString("pt-BR")} readOnly />
                    </div>
                </div>
            </div>

            {data.observacoes && (
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Observações Médicas</label>
                    <div className={`${styles.inputWrapper} ${styles.textareaWrapper}`}>
                        <FaStickyNote className={styles.inputIcon} />
                        <textarea value={data.observacoes} readOnly rows={3} />
                    </div>
                </div>
            )}
        </div>
    );
};