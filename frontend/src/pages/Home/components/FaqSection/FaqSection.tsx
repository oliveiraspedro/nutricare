import React, { useState } from 'react';
import styles from './FaqSection.module.css';

const faqsData = [
    { question: "O serviço é pago?", answer: "Não! O NutriCare é totalmente gratuito para nutricionistas e pacientes. Você pode criar dietas e acompanhar seus pacientes sem custo algum." },
    { question: "Preciso ser nutricionista para usar a plataforma?", answer: "Não! Pacientes também podem usar o NutriCare para acessar suas dietas e acompanhar sua rotina alimentar. No entanto, a criação de planos alimentares é exclusiva para nutricionistas." },
    { question: "Posso acessar o NutriCare pelo celular?", answer: "Sim! A plataforma NutriCare é responsiva e funciona perfeitamente em celulares, tablets e computadores. Você pode acompanhar tudo de onde estiver." },
];

export const FaqSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className={styles.faqSection}>
            <h2>Dúvidas frequentes</h2>
            <p>Talvez algumas das suas dúvidas possam estar aqui:</p>
            <div className={styles.faqList}>
                {faqsData.map((faq, index) => (
                    <div className={styles.faqItem} key={index}>
                        <button
                            onClick={() => toggleFAQ(index)}
                            className={`${styles.faqQuestion} ${openIndex === index ? styles.open : ''}`}
                            aria-expanded={openIndex === index}
                        >
                            {faq.question}
                            <span className={styles.arrow}>{openIndex === index ? '▲' : '▼'}</span>
                        </button>
                        {openIndex === index && (
                            <div className={styles.faqAnswer}>
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};