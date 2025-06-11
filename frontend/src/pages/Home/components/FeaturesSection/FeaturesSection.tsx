import React from 'react';
import styles from './FeaturesSection.module.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import saladaImg from '../../../../assets/img/salada.png';
import logo_verde from '../../../../assets/img/logo_verde.png';
import graficoCrescimento from '../../../../assets/img/grafico-de-crescimento.png';
import pratoImg from '../../../../assets/img/prato.png';
import calendarioImg from '../../../../assets/img/calendario.png';

const featuresData = [
    { img: graficoCrescimento, title: "Evolução Contínua e Simples de Seguir", desc: "Acompanhamento constante e adaptações conforme sua evolução." },
    { img: saladaImg, title: "Recomendações práticas e equilibradas", desc: "Opções acessíveis, saborosas e alinhadas com seus hábitos." },
    { img: logo_verde, title: "Plano alimentar ajustado ao seu perfil", desc: "Dietas elaboradas com base em suas necessidades e objetivos." },
    { img: pratoImg, title: "Variedade de suas Refeições", desc: "Desfrute de uma ampla seleção de refeições saudáveis e saborosas." },
    { img: calendarioImg, title: "Planejamento de Refeições Semanais", desc: "Mantenha a constância com um cronograma alimentar simples e eficaz." }
];

export const FeaturesSection = () => {
    return (
        <section className={styles.featuresSection}>
            <h2>O que oferecemos</h2>
            <div className={styles.cardWrapper}>
                <Swiper
                    modules={[Pagination, Navigation]}
                    spaceBetween={30}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    loop
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className={styles.customSwiper}
                >
                    {featuresData.map(({ img, title, desc }, index) => (
                        <SwiperSlide key={index}>
                            <div className={styles.card}>
                                <img src={img} alt={title} className={styles.cardImg} />
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};