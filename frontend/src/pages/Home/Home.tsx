import React from 'react';
import styles from './Home.module.css';

import { HeroSection } from './components/HeroSection/HeroSection';
import { FeaturesSection } from './components/FeaturesSection/FeaturesSection';
import { FaqSection } from './components/FaqSection/FaqSection';

const Home: React.FC = () => {
    return (
        <main className={styles.homePage}>
            <HeroSection />
            <FeaturesSection />
            <FaqSection />
        </main>
    );
};

export default Home;