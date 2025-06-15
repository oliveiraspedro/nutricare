import React, { useEffect, useState } from 'react';
import styles from './Perfil.module.css';
import { FaAppleAlt } from 'react-icons/fa';
import { PersonalDataCard, UserData } from './components/PersonalDataCard/PersonalDataCard';
import { AnthropometricDataCard } from './components/AnthropometricDataCard/AnthropometricDataCard';
import { SkeletonCard } from './components/SkeletonCard/SkeletonCard';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface DadosAntropometricos {
    peso: number | "";
    altura: number | "";
    circunferencia: number | "";
    dataAvaliacao: string;
    observacoes: string;
}

const Perfil = () => {
    const [personalData, setPersonalData] = useState<UserData | null>(null);
    const [antropometricData, setAntropometricData] = useState<DadosAntropometricos | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [userType] = useState<string | null>(() => localStorage.getItem("userType"));

    useEffect(() => {
        let isMounted = true;
        const loadProfileData = async () => {
            const token = localStorage.getItem('token');
            if (!token || !userType) {
                if(isMounted) setIsLoading(false);
                return;
            }

            const personalDataPromise = fetch(`${API_BASE_URL}/api/${userType}/profile`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json());
            
            const antropometricDataPromise = userType === 'paciente' 
                ? fetch(`${API_BASE_URL}/api/paciente/minha-avaliacao-recente`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.ok ? res.json() : null)
                : Promise.resolve(null);

            try {
                const [personalResult, antropometricResult] = await Promise.all([personalDataPromise, antropometricDataPromise]);

                if (isMounted) {
                    const profileData = userType === 'medico' ? personalResult.profile : personalResult.pacienteProfile;
                    setPersonalData(profileData);

                    // A verificação correta: se o resultado da API não for nulo
                    if (antropometricResult) {
                        setAntropometricData(antropometricResult);
                    }
                    
                    setIsLoading(false);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Falha ao carregar dados do perfil:", error);
                    setIsLoading(false);
                }
            }
        };

        loadProfileData();
        return () => { isMounted = false; };
    }, [userType]);

    if (isLoading) {
        return (
            <div className={styles.profileContainer}>
                <div className={styles.profileContent}>
                    <header className={styles.profileHeader}>
                        <FaAppleAlt className={styles.headerIcon} />
                        <div>
                            <h1>O Meu Perfil</h1>
                            <p>Faça a gestão das suas informações pessoais e de saúde</p>
                        </div>
                    </header>
                    <SkeletonCard hasAvatar={true} lines={4} />
                    {userType === 'paciente' && <SkeletonCard lines={5} />}
                </div>
            </div>
        );
    }

    return (
        <div className={styles.profileContainer}>
            <div className={styles.profileContent}>
                <header className={styles.profileHeader}>
                    <FaAppleAlt className={styles.headerIcon} />
                    <div>
                        <h1>O Meu Perfil</h1>
                        <p>Faça a gestão das suas informações pessoais e de saúde</p>
                    </div>
                </header>
                
                <PersonalDataCard userData={personalData} />

                {userType === 'paciente' && (
                    <AnthropometricDataCard data={antropometricData} />
                )}
            </div>
        </div>
    );
};

export default Perfil;
