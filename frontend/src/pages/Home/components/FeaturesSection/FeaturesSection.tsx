import React from 'react';
import styles from './FeaturesSection.module.css';
import { Salad, CalendarDays, TrendingUp, UtensilsCrossed, Sparkles } from 'lucide-react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const featuresData = [
    { 
        icon: <UtensilsCrossed size={48} />, 
        title: "Variedade de Refeições", 
        desc: "Desfrute de uma ampla seleção de refeições saudáveis e saborosas." 
    },
    { 
        icon: <CalendarDays size={48} />, 
        title: "Planejamento Semanal", 
        desc: "Mantenha a constância com um cronograma alimentar simples e eficaz." 
    },
    { 
        icon: <TrendingUp size={48} />, 
        title: "Evolução Contínua", 
        desc: "Acompanhamento e adaptações constantes conforme sua evolução." 
    },
    { 
        icon: <Salad size={48} />, 
        title: "Recomendações Equilibradas", 
        desc: "Opções acessíveis e alinhadas com seus hábitos e gostos." 
    },
    { 
        icon: <Sparkles size={48} />, 
        title: "Plano Personalizado", 
        desc: "Dietas elaboradas com base em suas necessidades e objetivos únicos." 
    }
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
                    navigation={{
                        nextEl: `.${styles.swiperButtonNext}`,
                        prevEl: `.${styles.swiperButtonPrev}`,
                    }}
                    pagination={{ clickable: true }}
                    loop
                    breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    className={styles.customSwiper}
                >
                    {featuresData.map(({ icon, title, desc }, index) => (
                        <SwiperSlide key={index}>
                            <div className={styles.card}>
                                <div className={styles.cardIcon}>{icon}</div>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                
                <div className={styles.swiperButtonPrev}></div>
                <div className={styles.swiperButtonNext}></div>
            </div>
        </section>
    );
};