import React, { useState } from 'react';
import { Clock, Apple, ChefHat, TrendingUp, Calendar, User, Phone } from 'lucide-react';
import './Dietas.css';

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
    name: "Max Maya",
    phone: "(13)9999-999",
    birthDate: "30/05/2005",
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
    <div className="diet-container">
      {/* Header */}
      <div className="diet-header">
        <div className="header-content">
          <div className="header-top">
            <div className="patient-info">
              <div className="user-avatar">
                <User className="user-icon" />
              </div>
              <div className="patient-details">
                <h1 className="page-title">Minha Dieta</h1>
                <p className="patient-name">{patientInfo.name}</p>
              </div>
            </div>
            <div className="contact-info">
              <div className="contact-item">
                <Phone className="contact-icon" />
                {patientInfo.phone}
              </div>
              <div className="contact-item">
                <Calendar className="contact-icon" />
                Atualizado em {patientInfo.lastUpdate}
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card stat-card-green">
              <div className="stat-content">
                <div className="stat-text">
                  <p className="stat-label">Refeições Concluídas</p>
                  <p className="stat-value">{completedMeals}/{meals.length}</p>
                </div>
                <ChefHat className="stat-icon" />
              </div>
            </div>
            <div className="stat-card stat-card-blue">
              <div className="stat-content">
                <div className="stat-text">
                  <p className="stat-label">Calorias do Dia</p>
                  <p className="stat-value">{totalDayCalories}</p>
                </div>
                <TrendingUp className="stat-icon" />
              </div>
            </div>
            <div className="stat-card stat-card-purple">
              <div className="stat-content">
                <div className="stat-text">
                  <p className="stat-label">Próxima Refeição</p>
                  <p className="stat-subtitle">
                    {meals.find(m => !m.completed)?.type || "Completo!"}
                  </p>
                </div>
                <Clock className="stat-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Day Selector */}
        <div className="day-selector">
          {['ontem', 'hoje', 'amanhã'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`day-button ${selectedDay === day ? 'day-button-active' : ''}`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
        </div>

        {/* Meals List */}
        <div className="meals-list">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`meal-card ${expandedMeal === meal.id ? 'meal-card-expanded' : ''}`}
            >
              {/* Meal Header */}
              <div
                className="meal-header"
                onClick={() => toggleMeal(meal.id)}
              >
                <div className="meal-header-content">
                  <div className="meal-info">
                    <div
                      className="meal-icon"
                      style={{ backgroundColor: `${meal.color}20` }}
                    >
                      {meal.icon}
                    </div>
                    <div className="meal-details">
                      <h3 className="meal-type">{meal.type}</h3>
                      <div className="meal-meta">
                        <div className="meal-time">
                          <Clock className="meta-icon" />
                          <span className="time-text">{meal.time}</span>
                        </div>
                        <div className="meal-calories">
                          <Apple className="meta-icon" />
                          <span>{meal.totalCalories} cal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="meal-actions">
                    {meal.completed && (
                      <div className="completed-badge">
                        <span className="completed-check">✓</span>
                      </div>
                    )}
                    <div className="expand-icon">
                      {expandedMeal === meal.id ? (
                        <span className="arrow arrow-up">▲</span>
                      ) : (
                        <span className="arrow arrow-down">▼</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedMeal === meal.id && (
                <div className="meal-details-expanded">
                  <div className="meal-foods-section">
                    <h4 className="foods-title">
                      <Apple className="foods-icon" />
                      Alimentos desta refeição:
                    </h4>
                    <div className="foods-list">
                      {meal.foods.map((food, index) => (
                        <div key={index} className="food-item">
                          <div className="food-info">
                            <p className="food-name">{food.name}</p>
                            <p className="food-quantity">{food.quantity}</p>
                          </div>
                          <div className="food-calories">
                            <p className="calories-text">{food.calories} cal</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Action Button */}
                    <div className="meal-action">
                      <button
                        onClick={() => markMealComplete(meal.id)}
                        className={`action-button ${meal.completed ? 'action-button-completed' : 'action-button-active'}`}
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
        <div className="summary-card">
          <h3 className="summary-title">Resumo do Dia</h3>
          <div className="summary-grid">
            <div className="summary-item summary-item-blue">
              <p className="summary-label">Meta Calórica</p>
              <p className="summary-value">1800</p>
            </div>
            <div className="summary-item summary-item-green">
              <p className="summary-label">Consumidas</p>
              <p className="summary-value">{totalDayCalories}</p>
            </div>
            <div className="summary-item summary-item-orange">
              <p className="summary-label">Restantes</p>
              <p className="summary-value">{1800 - totalDayCalories}</p>
            </div>
            <div className="summary-item summary-item-purple">
              <p className="summary-label">Progresso</p>
              <p className="summary-value">
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