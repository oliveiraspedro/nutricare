import React, { useState } from 'react';
import styles from './FaqSection.module.css';

const faqsData = [
    { question: "Qual o valor dos planos?", answer: "Os valores variam de acordo com o plano escolhido. Consulte a página de planos para mais informações." },
    { question: "É necessário ter acompanhamento?", answer: "Não é obrigatório, mas o acompanhamento profissional é sempre recomendado para melhores resultados." },
    { question: "Como acesso minha dieta?", answer: "Você pode acessar sua dieta diretamente pelo seu painel, após fazer login." },
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