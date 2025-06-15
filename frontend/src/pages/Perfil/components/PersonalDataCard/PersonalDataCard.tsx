import React, { useState, useEffect } from 'react';
import styles from './PersonalDataCard.module.css';
import { FaUserCircle, FaEnvelope, FaPhone, FaLock, FaEdit, FaSave, FaTimes, FaUserMd } from "react-icons/fa";

export interface UserData {
    name: string;
    email: string;
    phone: string;
    crm?: string;
}

interface Props {
    userData: UserData | null;
}

export const PersonalDataCard = ({ userData }: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<UserData | null>(userData);
    const [password, setPassword] = useState("**********");

    // Este useEffect é seguro, pois só é executado se a prop `userData` mudar
    useEffect(() => {
        setFormData(userData);
    }, [userData]);

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setFormData(userData);
        setIsEditing(false);
    };
    const handleSave = () => {
        console.log("A guardar dados:", formData);
        setIsEditing(false);
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        if (formData) {
            setFormData({ ...formData, [id]: value });
        }
    };

    if (!formData) {
        return null;
    }

    return (
        <div className={styles.profileCard}>
            <div className={styles.profileUser}>
                <FaUserCircle className={styles.userAvatar} />
                <h2>{formData.name}</h2>
            </div>
            <div className={styles.profileGrid}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <div className={`${styles.inputWrapper} ${!isEditing ? styles.readonly : ''}`}>
                        <FaEnvelope className={styles.inputIcon} />
                        <input id="email" type="email" value={formData.email} onChange={handleChange} readOnly={!isEditing} />
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label htmlFor="phone">Telefone</label>
                    <div className={`${styles.inputWrapper} ${!isEditing ? styles.readonly : ''}`}>
                        <FaPhone className={styles.inputIcon} />
                        <input id="phone" type="tel" value={formData.phone} onChange={handleChange} readOnly={!isEditing} />
                    </div>
                </div>
                {formData.crm && (
                    <div className={styles.inputGroup}>
                        <label htmlFor="crm">CRM</label>
                        <div className={`${styles.inputWrapper} ${!isEditing ? styles.readonly : ''}`}>
                            <FaUserMd className={styles.inputIcon} />
                            <input id="crm" type="text" value={formData.crm} onChange={handleChange} readOnly={!isEditing} />
                        </div>
                    </div>
                )}
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
                        <button onClick={handleCancel} className={`${styles.actionButton} ${styles.cancelButton}`}><FaTimes /> Cancelar</button>
                        <button onClick={handleSave} className={`${styles.actionButton} ${styles.saveButton}`}><FaSave /> Guardar</button>
                    </>
                ) : (
                    <button onClick={handleEdit} className={`${styles.actionButton} ${styles.editButton}`}><FaEdit /> Editar Dados</button>
                )}
            </div>
        </div>
    );
};