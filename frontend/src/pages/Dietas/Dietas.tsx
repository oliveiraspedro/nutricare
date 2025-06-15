import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Apple, ChefHat, TrendingUp, Calendar, User, Phone, Loader2, AlertCircle } from 'lucide-react';
import styles from './Dietas.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// --- TIPOS DE DADOS ---
// Estes tipos agora correspondem à estrutura que o backend envia
interface ApiFood { 
    id: string; 
    name_alimento: string; 
    quantity: number; 
    chosen_serving: { 
        serving_description: string;
    };
    calculated_nutrition: { 
        calories: number; 
        protein: number;
        carbohydrate: number;
        fat: number;
        fiber?: number; // Fibra é opcional
    }; 
}
interface ApiMeal { id: number; tipo: string; horario_sugerido: string; foods: ApiFood[]; concluida: boolean; }
interface PatientInfo { name: string; email: string; phone: string; }

// --- Objeto Auxiliar para Ícones e Cores ---
const mealVisuals: { [key: string]: { icon: string; color: string } } = {
    "Café da manhã": { icon: "☕", color: "#FF6B35" },
    "Lanche da manhã": { icon: "🍌", color: "#4ECDC4" },
    "Almoço": { icon: "🍽️", color: "#45B7D1" },
    "Lanche da tarde": { icon: "🥜", color: "#96CEB4" },
    "Jantar": { icon: "🥗", color: "#FFEAA7" },
    "Ceia": { icon: "🥛", color: "#D4A5A5" },
    "Padrão": { icon: "🍴", color: "#888" }
};
const getMealVisual = (type: string) => mealVisuals[type] || mealVisuals["Padrão"];

const Dietas: React.FC = () => {
    const [meals, setMeals] = useState<ApiMeal[]>([]);
    const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedMeal, setExpandedMeal] = useState<number | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchDietData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error("Utilizador não autenticado.");

                const response = await fetch(`${API_BASE_URL}/api/paciente/meu-plano`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Falha ao buscar os dados da dieta.');
                }
                const data = await response.json();
                
                if (isMounted) {
                    setPatientInfo(data.pacienteInfo);
                    setMeals(data.meals);
                }
            } catch (err) {
                if (isMounted) setError((err as Error).message);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchDietData();
        return () => { isMounted = false; };
    }, []);

    // --- Funções de Cálculo Corrigidas ---
    const calculateMealCalories = (meal: ApiMeal): number => {
        return meal.foods.reduce((sum, food) => sum + (Number(food.calculated_nutrition?.calories) || 0), 0);
    };
    
    const completedMealsCount = React.useMemo(() => meals.filter(meal => meal.concluida).length, [meals]);
    const caloriasConsumidas = React.useMemo(() => meals.filter(m => m.concluida).reduce((sum, meal) => sum + calculateMealCalories(meal), 0), [meals]);
    const metaCaloricaDoDia = React.useMemo(() => meals.reduce((sum, meal) => sum + calculateMealCalories(meal), 0), [meals]);
    const caloriasRestantes = metaCaloricaDoDia - caloriasConsumidas;
    const progresso = metaCaloricaDoDia > 0 ? Math.round((caloriasConsumidas / metaCaloricaDoDia) * 100) : 0;
    const nextMeal = React.useMemo(() => meals.find(m => !m.concluida)?.tipo || "Dieta Completa!", [meals]);
    
    // --- Handlers ---
    const toggleMeal = (mealId: number): void => setExpandedMeal(expandedMeal === mealId ? null : mealId);
    
    const handleMarkComplete = async (mealId: number) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/paciente/diario/concluir`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ refeicaoId: mealId })
            });
            if (!response.ok) throw new Error('Não foi possível marcar a refeição.');
            setMeals(meals.map(m => m.id === mealId ? { ...m, concluida: true } : m));
        } catch (err) {
            alert(`Erro: ${(err as Error).message}`);
        }
    };

    if (isLoading) {
        return <div className={styles['loading-container']}><Loader2 className={styles['spinner']} /><p>A carregar a sua dieta...</p></div>;
    }
    if (error) {
        return <div className={styles['loading-container']}><AlertCircle className={styles['error-icon']} /><p className={styles['error-message']}>Erro: {error}</p></div>;
    }
    if (!patientInfo || meals.length === 0) {
        return <div className={styles['loading-container']}><p>Nenhuma dieta encontrada para si de momento.</p></div>;
    }

    return (
        <div className={styles['diet-container']}>
            <div className={styles['diet-header']}>
                <div className={styles['header-content']}>
                    <div className={styles['header-top']}>
                        <div className={styles['patient-info']}>
                            <div className={styles['user-avatar']}><User className={styles['user-icon']} /></div>
                            <div className={styles['patient-details']}>
                                <h1 className={styles['page-title']}>A Minha Dieta</h1>
                                <p className={styles['patient-name']}>{patientInfo.name}</p>
                            </div>
                        </div>
                        <div className={styles['contact-info']}>
                            <div className={styles['contact-item']}><Phone className={styles['contact-icon']} /> {patientInfo.phone}</div>
                            <div className={styles['contact-item']}><Calendar className={styles['contact-icon']} /> Atualizado em {new Date().toLocaleDateString('pt-PT')}</div>
                        </div>
                    </div>
                    <div className={styles['stats-grid']}>
                        <div className={`${styles['stat-card']} ${styles['stat-card-green']}`}><div className={styles['stat-content']}><div className={styles['stat-text']}><p className={styles['stat-label']}>Refeições Concluídas</p><p className={styles['stat-value']}>{completedMealsCount}/{meals.length}</p></div><ChefHat className={styles['stat-icon']} /></div></div>
                        <div className={`${styles['stat-card']} ${styles['stat-card-blue']}`}><div className={styles['stat-content']}><div className={styles['stat-text']}><p className={styles['stat-label']}>Calorias Consumidas</p><p className={styles['stat-value']}>{caloriasConsumidas.toFixed(0)}</p></div><TrendingUp className={styles['stat-icon']} /></div></div>
                        <div className={`${styles['stat-card']} ${styles['stat-card-purple']}`}><div className={styles['stat-content']}><div className={styles['stat-text']}><p className={styles['stat-label']}>Próxima Refeição</p><p className={styles['stat-subtitle']}>{nextMeal}</p></div><Clock className={styles['stat-icon']} /></div></div>
                    </div>
                </div>
            </div>
            <div className={styles['main-content']}>
                <div className={styles['meals-list']}>
                    {meals.map((meal) => {
                        const visual = getMealVisual(meal.tipo);
                        const mealCalories = calculateMealCalories(meal);
                        return (
                            <div key={meal.id} className={`${styles['meal-card']} ${expandedMeal === meal.id ? styles['meal-card-expanded'] : ''}`}>
                                <div className={styles['meal-header']} onClick={() => toggleMeal(meal.id)}>
                                    <div className={styles['meal-header-content']}>
                                        <div className={styles['meal-info']}>
                                            <div className={styles['meal-icon']} style={{ backgroundColor: `${visual.color}20`, color: visual.color }}>{visual.icon}</div>
                                            <div className={styles['meal-details']}>
                                                <h3 className={styles['meal-type']}>{meal.tipo}</h3>
                                                <div className={styles['meal-meta']}>
                                                    <div className={styles['meal-time']}><Clock className={styles['meta-icon']} /><span className={styles['time-text']}>{meal.horario_sugerido}</span></div>
                                                    <div className={styles['meal-calories']}><Apple className={styles['meta-icon']} /><span>{mealCalories.toFixed(0)} cal</span></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles['meal-actions']}>
                                            {meal.concluida && <div className={styles['completed-badge']}><span className={styles['completed-check']}>✓</span></div>}
                                            <div className={styles['expand-icon']}>{expandedMeal === meal.id ? <span className={`${styles.arrow} ${styles['arrow-up']}`}>▲</span> : <span className={`${styles.arrow} ${styles['arrow-down']}`}>▼</span>}</div>
                                        </div>
                                    </div>
                                </div>
                                {expandedMeal === meal.id && (
                                    <div className={styles['meal-details-expanded']}>
                                        <div className={styles['meal-foods-section']}>
                                            <h4 className={styles['foods-title']}><Apple className={styles['foods-icon']} /> Alimentos desta refeição:</h4>
                                            <div className={styles['foods-list']}>
                                                {meal.foods.length > 0 ? meal.foods.map((food, index) => (
                                                    <div key={food.id || index} className={styles['food-item']}>
                                                        <div className={styles['food-info']}>
                                                            <p className={styles['food-name']}>{food.name_alimento}</p>
                                                            {/* CORREÇÃO: Acedemos à estrutura aninhada */}
                                                            <p className={styles['food-quantity']}>{food.quantity} x {food.chosen_serving?.serving_description}</p>
                                                        </div>
                                                        <div className={styles['food-calories']}>
                                                            {/* CORREÇÃO: Acedemos à estrutura aninhada */}
                                                            <p className={styles['calories-text']}>{food.calculated_nutrition?.calories.toFixed(0)} cal</p>
                                                        </div>
                                                    </div>
                                                )) : <p className={styles['no-food-message']}>Nenhum alimento detalhado para esta refeição.</p>}
                                            </div>
                                            <div className={styles['meal-action']}>
                                                <button onClick={() => handleMarkComplete(meal.id)} className={`${styles['action-button']} ${meal.concluida ? styles['action-button-completed'] : styles['action-button-active']}`} disabled={meal.concluida}>
                                                    {meal.concluida ? '✓ Refeição Concluída' : 'Marcar como Concluída'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className={styles['summary-card']}>
                    <h3 className={styles['summary-title']}>Resumo do Dia</h3>
                    <div className={styles['summary-grid']}>
                        <div className={`${styles['summary-item']} ${styles['summary-item-blue']}`}><p className={styles['summary-label']}>Meta Calórica</p><p className={styles['summary-value']}>{metaCaloricaDoDia.toFixed(0)}</p></div>
                        <div className={`${styles['summary-item']} ${styles['summary-item-green']}`}><p className={styles['summary-label']}>Consumidas</p><p className={styles['summary-value']}>{caloriasConsumidas.toFixed(0)}</p></div>
                        <div className={`${styles['summary-item']} ${styles['summary-item-orange']}`}><p className={styles['summary-label']}>Restantes</p><p className={styles['summary-value']}>{caloriasRestantes > 0 ? caloriasRestantes.toFixed(0) : 0}</p></div>
                        <div className={`${styles['summary-item']} ${styles['summary-item-purple']}`}><p className={styles['summary-label']}>Progresso</p><p className={styles['summary-value']}>{progresso}%</p></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dietas;