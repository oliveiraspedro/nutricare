import React, { useState } from "react";
import './Home.css';
import '../../components/Footer/Footer.css';
import mulherSaudavel from '../../assets/img/mulher-comida-saudavel.png';
import saladaImg from '../../assets/img/salada.png';
import logo_verde from '../../assets/img/logo_verde.png';
import graficoCrescimento from '../../assets/img/grafico-de-crescimento.png';
import pratoImg from '../../assets/img/prato.png';
import calendarioImg from '../../assets/img/calendario.png';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const Home: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqs = [
        { question: "Qual o valor dos planos?", answer: "Os valores variam de acordo com o plano escolhido. Consulte a página de planos para mais informações." },
        { question: "É necessário ter acompanhamento?", answer: "Não é obrigatório, mas o acompanhamento profissional é sempre recomendado para melhores resultados." },
        { question: "Como acesso minha dieta?", answer: "Você pode acessar sua dieta diretamente pelo seu painel, após fazer login." },
    ];

    return (
        <>
            <div className="home-content">
                <h1>Criando Dietas Personalizadas<br /> para uma Vida Mais Saudável!</h1>
                <p>Seja para ganhar saúde, melhorar desempenho<br /> ou lidar com restrições, o NutriCare te ajuda a<br /> encontrar a dieta ideal.</p>
                <a href="/login" className="btn">Conheça nossas Dietas!</a>
                <div className="square">
                    <img src={mulherSaudavel} alt="mulher-cozinhando" loading="lazy" />
                </div>
            </div>

            <section className="oferecemos">
                <h2>O que oferecemos</h2>
                <div className="card-wrapper">
                    <Swiper
                        modules={[Pagination, Navigation]}
                        spaceBetween={20}  // Maior espaço entre os cards
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        loop
                        autoplay={{ delay: 3000, disableOnInteraction: false }} // Slide automático
                        breakpoints={{
                            768: { slidesPerView: 2 },
                            1024: { slidesPerView: 3 },
                        }}
                        className="custom-swiper"
                    >
                        {[
                            { img: graficoCrescimento, title: "Evolução Contínua e Simples de Seguir", desc: "Acompanhamento constante e adaptações conforme sua evolução." },
                            { img: saladaImg, title: "Recomendações práticas e equilibradas", desc: "Incluímos opções acessíveis, saborosas e alinhadas com seus hábitos." },
                            { img: logo_verde, title: "Plano alimentar ajustado ao seu perfil", desc: "Dietas elaboradas com base em suas necessidades e objetivos específicos." },
                            { img: pratoImg, title: "Variedade de suas Refeições", desc: "Desfrute de uma ampla seleção de refeições saudáveis e saborosas." },
                            { img: calendarioImg, title: "Planejamento de Refeições Semanais", desc: "Mantenha a constância com um cronograma alimentar simples e eficaz." }
                        ].map(({ img, title, desc }, index) => (
                            <SwiperSlide key={index}>
                                <div className="card">
                                    <h3>
                                        <img src={img} alt="emoji" className="card-img" /><br />
                                        {title}
                                    </h3>
                                    <p>{desc}</p>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            <section className="faq">
                <h2>Dúvidas frequentes</h2>
                <p>De uma olhada! Talvez algumas das suas dúvidas possam estar aqui:</p>
                {faqs.map((faq, index) => (
                    <div className="faq-item" key={index}>
                        <button
                            onClick={() => toggleFAQ(index)}
                            className={`faq-question ${openIndex === index ? 'open' : ''}`}
                            aria-expanded={openIndex === index ? 'true' : 'false'}
                        >
                            {faq.question}
                            <span className="arrow">{openIndex === index ? '▲' : '▼'}</span>
                        </button>
                        {openIndex === index && (
                            <div className="faq-answer">
                                <p>{faq.answer}</p>
                            </div>
                        )}
                    </div>
                ))}
            </section>
        </>
    );
};

export default Home;
