import React, { useState } from 'react';
import { Clock, Apple, ChefHat, TrendingUp, Calendar, User, Phone } from 'lucide-react';
import styles from './Dietas.module.css';

interface Food {
  name: string;
  quantity: string;
  calories: number;
}

interface Meal {
  id: number;
  type: string;
  time: string;
  icon: string;
  color: string;
  foods: Food[];
  totalCalories: number;
  completed: boolean;
}

interface PatientInfo {
  name: string;
  phone: string;
  birthDate: string;
  lastUpdate: string;
}

const Dietas: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('hoje');
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);

  const patientInfo: PatientInfo = {
    name: "Márcio",
    phone: "(11)98053-4570",
    birthDate: "15/08/2005",
    lastUpdate: "15/06/2025"
  };

  const meals: Meal[] = [
    {
      id: 1,
      type: "Café da manhã",
      time: "07:00",
      icon: "☕",
      color: "#FF6B35",
      foods: [
        { name: "Pão francês", quantity: "1 unidade(s) ou 50g", calories: 135 },
        { name: "Ovo de galinha", quantity: "1 unidade(s) ou 50g", calories: 70 }
      ],
      totalCalories: 205,
      completed: true
    },
    {
      id: 2,
      type: "Lanche da manhã",
      time: "10:00",
      icon: "🍌",
      color: "#4ECDC4",
      foods: [
        { name: "Banana prata", quantity: "1 unidade(s) ou 86g", calories: 89 },
        { name: "Aveia", quantity: "2 colheres de sopa", calories: 68 }
      ],
      totalCalories: 157,
      completed: false
    },
    {
      id: 3,
      type: "Almoço",
      time: "12:30",
      icon: "🍽️",
      color: "#45B7D1",
      foods: [
        { name: "Arroz integral", quantity: "3 colheres de sopa", calories: 108 },
        { name: "Peito de frango", quantity: "100g", calories: 165 },
        { name: "Brócolis cozido", quantity: "1 xícara", calories: 25 }
      ],
      totalCalories: 298,
      completed: false
    },
    {
      id: 4,
      type: "Lanche da tarde",
      time: "15:30",
      icon: "🥜",
      color: "#96CEB4",
      foods: [
        { name: "Castanha do Brasil", quantity: "3 unidades", calories: 99 },
        { name: "Maçã", quantity: "1 unidade média", calories: 52 }
      ],
      totalCalories: 151,
      completed: false
    },
    {
      id: 5,
      type: "Jantar",
      time: "19:00",
      icon: "🥗",
      color: "#FFEAA7",
      foods: [
        { name: "Salmão grelhado", quantity: "120g", calories: 231 },
        { name: "Batata doce", quantity: "1 unidade média", calories: 103 },
        { name: "Salada verde", quantity: "1 prato", calories: 20 }
      ],
      totalCalories: 354,
      completed: false
    }
  ];

  const totalDayCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const completedMeals = meals.filter(meal => meal.completed).length;

  const toggleMeal = (mealId: number): void => {
    setExpandedMeal(expandedMeal === mealId ? null : mealId);
  };

  const markMealComplete = (mealId: number): void => {
    // Aqui seria implementada a lógica para marcar refeição como completa
    console.log(`Meal ${mealId} marked as complete`);
  };

  return (
    <div className={styles['diet-container']}>
      {/* Header */}
      <div className={styles['diet-header']}>
        <div className={styles['header-content']}>
          <div className={styles['header-top']}>
            <div className={styles['patient-info']}>
              <div className={styles['user-avatar']}>
                <User className={styles['user-icon']} />
              </div>
              <div className={styles['patient-details']}>
                <h1 className={styles['page-title']}>Minha Dieta</h1>
                <p className={styles['patient-name']}>{patientInfo.name}</p>
              </div>
            </div>
            <div className={styles['contact-info']}>
              <div className={styles['contact-item']}>
                <Phone className={styles['contact-icon']} />
                {patientInfo.phone}
              </div>
              <div className={styles['contact-item']}>
                <Calendar className={styles['contact-icon']} />
                Atualizado em {patientInfo.lastUpdate}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles['stats-grid']}>
            <div className={`${styles['stat-card']} ${styles['stat-card-green']}`}>
              <div className={styles['stat-content']}>
                <div className={styles['stat-text']}>
                  <p className={styles['stat-label']}>Refeições Concluídas</p>
                  <p className={styles['stat-value']}>{completedMeals}/{meals.length}</p>
                </div>
                <ChefHat className={styles['stat-icon']} />
              </div>
            </div>
            <div className={`${styles['stat-card']} ${styles['stat-card-blue']}`}>
              <div className={styles['stat-content']}>
                <div className={styles['stat-text']}>
                  <p className={styles['stat-label']}>Calorias do Dia</p>
                  <p className={styles['stat-value']}>{totalDayCalories}</p>
                </div>
                <TrendingUp className={styles['stat-icon']} />
              </div>
            </div>
            <div className={`${styles['stat-card']} ${styles['stat-card-purple']}`}>
              <div className={styles['stat-content']}>
                <div className={styles['stat-text']}>
                  <p className={styles['stat-label']}>Próxima Refeição</p>
                  <p className={styles['stat-subtitle']}>
                    {meals.find(m => !m.completed)?.type || "Completo!"}
                  </p>
                </div>
                <Clock className={styles['stat-icon']} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles['main-content']}>
        {/* Day Selector */}
        <div className={styles['day-selector']}>
          {['ontem', 'hoje', 'amanhã'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`${styles['day-button']} ${selectedDay === day ? styles['day-button-active'] : ''}`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
        </div>

        {/* Meals List */}
        <div className={styles['meals-list']}>
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`${styles['meal-card']} ${expandedMeal === meal.id ? styles['meal-card-expanded'] : ''}`}
            >
              {/* Meal Header */}
              <div
                className={styles['meal-header']}
                onClick={() => toggleMeal(meal.id)}
              >
                <div className={styles['meal-header-content']}>
                  <div className={styles['meal-info']}>
                    <div
                      className={styles['meal-icon']}
                      style={{ backgroundColor: `${meal.color}20` }}
                    >
                      {meal.icon}
                    </div>
                    <div className={styles['meal-details']}>
                      <h3 className={styles['meal-type']}>{meal.type}</h3>
                      <div className={styles['meal-meta']}>
                        <div className={styles['meal-time']}>
                          <Clock className={styles['meta-icon']} />
                          <span className={styles['time-text']}>{meal.time}</span>
                        </div>
                        <div className={styles['meal-calories']}>
                          <Apple className={styles['meta-icon']} />
                          <span>{meal.totalCalories} cal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles['meal-actions']}>
                    {meal.completed && (
                      <div className={styles['completed-badge']}>
                        <span className={styles['completed-check']}>✓</span>
                      </div>
                    )}
                    <div className={styles['expand-icon']}>
                      {expandedMeal === meal.id ? (
                        <span className={`${styles.arrow} ${styles['arrow-up']}`}>▲</span>
                      ) : (
                        <span className={`${styles.arrow} ${styles['arrow-down']}`}>▼</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedMeal === meal.id && (
                <div className={styles['meal-details-expanded']}>
                  <div className={styles['meal-foods-section']}>
                    <h4 className={styles['foods-title']}>
                      <Apple className={styles['foods-icon']} />
                      Alimentos desta refeição:
                    </h4>
                    <div className={styles['foods-list']}>
                      {meal.foods.map((food, index) => (
                        <div key={index} className={styles['food-item']}>
                          <div className={styles['food-info']}>
                            <p className={styles['food-name']}>{food.name}</p>
                            <p className={styles['food-quantity']}>{food.quantity}</p>
                          </div>
                          <div className={styles['food-calories']}>
                            <p className={styles['calories-text']}>{food.calories} cal</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Button */}
                    <div className={styles['meal-action']}>
                      <button
                        onClick={() => markMealComplete(meal.id)}
                        className={`${styles['action-button']} ${meal.completed ? styles['action-button-completed'] : styles['action-button-active']}`}
                        disabled={meal.completed}
                      >
                        {meal.completed ? '✓ Refeição Concluída' : 'Marcar como Concluída'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className={styles['summary-card']}>
          <h3 className={styles['summary-title']}>Resumo do Dia</h3>
          <div className={styles['summary-grid']}>
            <div className={`${styles['summary-item']} ${styles['summary-item-blue']}`}>
              <p className={styles['summary-label']}>Meta Calórica</p>
              <p className={styles['summary-value']}>1800</p>
            </div>
            <div className={`${styles['summary-item']} ${styles['summary-item-green']}`}>
              <p className={styles['summary-label']}>Consumidas</p>
              <p className={styles['summary-value']}>{totalDayCalories}</p>
            </div>
            <div className={`${styles['summary-item']} ${styles['summary-item-orange']}`}>
              <p className={styles['summary-label']}>Restantes</p>
              <p className={styles['summary-value']}>{1800 - totalDayCalories}</p>
            </div>
            <div className={`${styles['summary-item']} ${styles['summary-item-purple']}`}>
              <p className={styles['summary-label']}>Progresso</p>
              <p className={styles['summary-value']}>
                {Math.round((totalDayCalories / 1800) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dietas;