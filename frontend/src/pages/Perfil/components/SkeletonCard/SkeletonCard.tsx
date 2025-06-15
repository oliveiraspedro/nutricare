import React from 'react';
import styles from './SkeletonCard.module.css';

// Props para customizar o esqueleto
interface SkeletonCardProps {
  // Quantas linhas de "texto" o esqueleto deve ter
  lines?: number;
  // Se deve mostrar um placeholder de avatar circular
  hasAvatar?: boolean;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ lines = 4, hasAvatar = false }) => {
  return (
    <div className={styles.skeletonCard}>
      {hasAvatar && (
        <div className={styles.skeletonHeader}>
          <div className={`${styles.skeletonAvatar} ${styles.shimmer}`} />
          <div className={styles.skeletonUserInfo}>
            <div className={`${styles.skeletonLine} ${styles.shimmer}`} style={{ width: '50%' }} />
          </div>
        </div>
      )}
      
      <div className={styles.skeletonContent}>
        {/* Cria um array com o número de linhas desejado e o mapeia */}
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${styles.skeletonLine} ${styles.shimmer}`}
            // Faz com que as linhas tenham larguras variadas para parecer mais natural
            style={{ width: `${80 - (index * 10)}%` }}
          />
        ))}
      </div>
    </div>
  );
};
