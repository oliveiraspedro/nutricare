import React, { useState, useEffect } from 'react';
import styles from './PersonalDataCard.module.css';
import { FaUserCircle, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes, FaUserMd } from "react-icons/fa";

// Simulando dados que viriam do backend
const mockPacienteData = { name: 'Max Maya', email: 'max@gmail.com', phone: '(11) 98372-0456' };
const mockMedicoData = { name: 'Dr. Carlos', email: 'carlos.almeida@nutricare.com', phone: '(21) 91234-5678', crm: 'RJ-123456' };

interface UserData {
    name: string;
    email: string;
    phone: string;
    crm?: string;
}

interface Props {
    userType: string | null;
}

export const PersonalDataCard = ({ userType }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState<UserData>({ name: '', email: '', phone: '', crm: '' });
    const [initialData, setInitialData] = useState<UserData>({ name: '', email: '', phone: '', crm: '' });
    const [password, setPassword] = useState("**********");

    // Simula a busca de dados com base no userType
    useEffect(() => {
        if (userType === 'medico') {
            setUserData(mockMedicoData);
            setInitialData(mockMedicoData);
        } else if (userType === 'paciente') {
            setUserData(mockPacienteData);
            setInitialData(mockPacienteData);
        }
    }, [userType]);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setUserData(initialData); // Restaura os dados originais
        setIsEditing(false);
    };
    const handleSave = () => {
        console.log("Salvando dados:", userData);
        setInitialData(userData); // Atualiza os dados "originais" com os novos
        setIsEditing(false);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setUserData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <div className={styles.profileCard}>
            <div className={styles.profileUser}>
                <FaUserCircle className={styles.userAvatar} />
                <h2>{userData.name}</h2>
            </div>

            <div className={styles.profileGrid}>
                {/* Email */}
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <div className={`${styles.inputWrapper} ${!isEditing ? styles.readonly : ''}`}>
                        <FaEnvelope className={styles.inputIcon} />
                        <input id="email" type="email" value={userData.email} onChange={handleChange} readOnly={!isEditing} />
                    </div>
                </div>

                {/* Telefone */}
                <div className={styles.inputGroup}>
                    <label htmlFor="phone">Telefone</label>
                    <div className={`${styles.inputWrapper} ${!isEditing ? styles.readonly : ''}`}>
                        <FaPhone className={styles.inputIcon} />
                        <input id="phone" type="tel" value={userData.phone} onChange={handleChange} readOnly={!isEditing} />
                    </div>
                </div>

                {/* ▼▼▼ CAMPO DE CRM CONDICIONAL ▼▼▼ */}
                {userType === 'medico' && (
                    <div className={styles.inputGroup}>
                        <label htmlFor="crm">CRM</label>
                        <div className={`${styles.inputWrapper} ${!isEditing ? styles.readonly : ''}`}>
                            <FaUserMd className={styles.inputIcon} />
                            <input id="crm" type="text" value={userData.crm} onChange={handleChange} readOnly={!isEditing} />
                        </div>
                    </div>
                )}
                
                {/* Senha */}
                <div className={styles.inputGroup}>
                    <label htmlFor="senha">Senha</label>
                    <div className={`${styles.inputWrapper} ${styles.readonly}`}>
                        <FaLock className={styles.inputIcon} />
                        <input id="senha" type="password" value={password} readOnly />
                    </div>
                </div>
            </div>

            <div className={styles.buttonContainer}>
                {isEditing ? (
                    <>
                        <button onClick={handleCancel} className={`${styles.actionButton} ${styles.cancelButton}`}>
                            <FaTimes /> Cancelar
                        </button>
                        <button onClick={handleSave} className={`${styles.actionButton} ${styles.saveButton}`}>
                            <FaSave /> Salvar
                        </button>
                    </>
                ) : (
                    <button onClick={handleEdit} className={`${styles.actionButton} ${styles.editButton}`}>
                        <FaEdit /> Editar Dados
                    </button>
                )}
            </div>
        </div>
    );
};