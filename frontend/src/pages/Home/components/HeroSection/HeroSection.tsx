import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';
import mulherSaudavel from '../../../../assets/img/mulher-comida-saudavel.png';

export const HeroSection = () => {
    return (
        <section className={styles.heroContainer}>
            <div className={styles.heroText}>
                <h1>Nutricionista, Está na Hora de Modernizar Seu Consultório!</h1>
<p>Otimize sua rotina, ganhe tempo e ofereça um atendimento mais completo com a plataforma NutriCare.</p>
<Link to="/register" className={styles.heroButton}>Comece Agora!</Link>
            </div>
            <div className={styles.heroImageContainer}>
                <div className={styles.rotatingSquare}>
                    <img src={mulherSaudavel} alt="Mulher com comida saudável" loading="lazy" />
                </div>
            </div>
        </section>
    );
};