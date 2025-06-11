import React, { useEffect, useState } from 'react';
import styles from './Perfil.module.css';
import { FaAppleAlt } from 'react-icons/fa';

import { PersonalDataCard } from './components/PersonalDataCard/PersonalDataCard';
import { AnthropometricDataCard } from './components/AnthropometricDataCard/AnthropometricDataCard';

interface DadosAntropometricos {
    peso: number | "";
    altura: number | "";
    circunferencia: number | "";
    dataAvaliacao: string;
    observacoes: string;
}

const mockAntropometricData: DadosAntropometricos = {
    peso: 61.0,
    altura: 161,
    circunferencia: 60,
    dataAvaliacao: "2025-06-03",
    observacoes: "Paciente apresenta boa evolução no programa nutricional.",
};

const Perfil = () => {
    const [userType, setUserType] = useState<string | null>(null);
    const [antropometricData, setAntropometricData] = useState<DadosAntropometricos | null>(null);

    useEffect(() => {
        const type = localStorage.getItem("userType");
        setUserType(type);

        if (type === 'paciente') {
            setAntropometricData(mockAntropometricData);
        }
    }, []);

    return (
        <div className={styles.profileContainer}>
            {/* ▼▼▼ NOVO WRAPPER PARA ALINHAMENTO ▼▼▼ */}
            <div className={styles.profileContent}>
                <header className={styles.profileHeader}>
                    <FaAppleAlt className={styles.headerIcon} />
                    <div>
                        <h1>Meu Perfil</h1>
                        <p>Gerencie suas informações pessoais e de saúde</p>
                    </div>
                </header>

                {/* Passando userType para o componente filho */}
                <PersonalDataCard userType={userType} />

                {userType === 'paciente' && (
                    <AnthropometricDataCard data={antropometricData} />
                )}
            </div>
        </div>
    );
};

export default Perfil;