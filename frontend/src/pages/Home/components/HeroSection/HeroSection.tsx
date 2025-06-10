import React from 'react';
import { Link } from 'react-router-dom';
import styles from './HeroSection.module.css';
import mulherSaudavel from '../../../../assets/img/mulher-comida-saudavel.png';

export const HeroSection = () => {
    return (
        <section className={styles.heroContainer}>
            <div className={styles.heroText}>
                <h1>Criando Dietas Personalizadas<br /> para uma Vida Mais Saudável!</h1>
                <p>Seja para ganhar saúde, melhorar desempenho ou lidar com restrições, o NutriCare te ajuda a encontrar a dieta ideal.</p>
                <Link to="/register" className={styles.heroButton}>Conheça nossas Dietas!</Link>
            </div>
            <div className={styles.heroImageContainer}>
                <div className={styles.rotatingSquare}>
                    <img src={mulherSaudavel} alt="Mulher com comida saudável" loading="lazy" />
                </div>
            </div>
        </section>
    );
};