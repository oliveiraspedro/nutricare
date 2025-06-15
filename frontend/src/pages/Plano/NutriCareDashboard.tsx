import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useParams } from "react-router-dom";
import styles from "./NutriCare.module.css";
import Button from "../../components/Button/Button";
import RecipesApp from "./components/RecipesApp/RecipesApp";
import FoodPrescriptionModal, { Food } from "./components/FoodPrescriptionModal/FoodPrescriptionModal";
import { MdRestaurant, MdDelete } from "react-icons/md";
import { Loader2 } from "lucide-react";

// --- TIPOS DE DADOS ---
// CORREÇÃO: Alinhamos o tipo com os dados que vêm do backend.
type Meal = {
  id: number;
  horario_sugerido: string;
  tipo: string; 
  foods: Food[];
};

type PacienteInfo = {
    name: string;
    phone: string;
}

const NutriCareDashboard = () => {
  const { pacienteEmail } = useParams<{ pacienteEmail: string }>();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // --- ESTADOS DO COMPONENTE ---
  const [meals, setMeals] = useState<Meal[]>([]);
  const [pacienteInfo, setPacienteInfo] = useState<PacienteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showRecipesModal, setShowRecipesModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [expandedMeals, setExpandedMeals] = useState<number[]>([]);
  const [nutritionData, setNutritionData] = useState<any[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

  // --- BUSCA DE DADOS ---
  useEffect(() => {
    const fetchPlanoAlimentar = async () => {
      if (!pacienteEmail) return;
      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `${API_BASE_URL}/api/pacientes/${pacienteEmail}/plano-alimentar`,
          { headers: { "Authorization": `Bearer ${token}` } }
        );
        if (response.ok) {
          const data = await response.json();
          setPacienteInfo(data.pacienteInfo);
          setMeals(data.meals);
        } else {
            throw new Error("Falha ao buscar plano alimentar.");
        }
      } catch (error) {
        console.error("Erro ao carregar plano alimentar:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlanoAlimentar();
  }, [pacienteEmail]);

  // --- CÁLCULOS ---
  const calculateMealTotals = (meal: any) => {
    const totals = { calories: 0, protein: 0, carbohydrate: 0, fat: 0 };
    if (meal?.foods) {
      meal.foods.forEach((food: any) => {
        totals.calories += Number(food.calculated_nutrition?.calories || food.calorias) || 0;
        totals.protein += Number(food.calculated_nutrition?.protein || food.proteinas) || 0;
        totals.carbohydrate += Number(food.calculated_nutrition?.carbohydrate || food.carboidratos) || 0;
        totals.fat += Number(food.calculated_nutrition?.fat || food.gorduras) || 0;
      });
    }
    return totals;
  };

  useEffect(() => {
    const totals = { calories: 0, protein: 0, carbohydrate: 0, fat: 0, fiber: 0 };
    meals.forEach((meal) => {
        if(meal?.foods){
            meal.foods.forEach((food) => {
                totals.calories += Number(food.calculated_nutrition?.calories) || 0;
                totals.protein += Number(food.calculated_nutrition?.protein) || 0;
                totals.carbohydrate += Number(food.calculated_nutrition?.carbohydrate) || 0;
                totals.fat += Number(food.calculated_nutrition?.fat) || 0;
                totals.fiber += Number(food.calculated_nutrition?.fiber) || 0;
            });
        }
    });

    const totalMacroCalories = totals.protein * 4 + totals.carbohydrate * 4 + totals.fat * 9;

    if (totalMacroCalories > 0) {
      const colors = ["#4CAF50", "#1687C6", "#FFC107"];
      setNutritionData([
        { name: "Carboidratos", value: parseFloat((((totals.carbohydrate * 4) / totalMacroCalories) * 100).toFixed(1)), color: colors[0] },
        { name: "Proteínas", value: parseFloat((((totals.protein * 4) / totalMacroCalories) * 100).toFixed(1)), color: colors[1] },
        { name: "Gorduras", value: parseFloat((((totals.fat * 9) / totalMacroCalories) * 100).toFixed(1)), color: colors[2] },
      ]);
    } else {
      setNutritionData([]);
    }
  }, [meals]);

  const nutritionTableData = useMemo(() => {
    const totals = { calories: 0, protein: 0, carbohydrate: 0, fat: 0, fiber: 0 };
    meals.forEach((meal: any) => {
        if (meal?.foods) {
            meal.foods.forEach((food: any) => {
                totals.calories += Number(food.calculated_nutrition?.calories || food.calorias) || 0;
                totals.protein += Number(food.calculated_nutrition?.protein || food.proteinas) || 0;
                totals.carbohydrate += Number(food.calculated_nutrition?.carbohydrate || food.carboidratos) || 0;
                totals.fat += Number(food.calculated_nutrition?.fat || food.gorduras) || 0;
                totals.fiber += Number(food.calculated_nutrition?.fiber || 0) || 0;
            });
        }
    });
    return [
      { nutrient: "Calorias totais", value: `${totals.calories.toFixed(0)}kcal` },
      { nutrient: "Proteínas totais", value: `${totals.protein.toFixed(1)}g` },
      { nutrient: "Lipídios totais", value: `${totals.fat.toFixed(1)}g` },
      { nutrient: "Carboidratos totais", value: `${totals.carbohydrate.toFixed(1)}g` },
      { nutrient: "Fibras totais", value: `${totals.fiber.toFixed(1)}g` },
    ];
  }, [meals]);

  // --- HANDLERS ---
  const onPieEnter = (_: any, index: number) => setSelectedSegment(index);
  const onPieLeave = () => setSelectedSegment(null);

  const addMeal = async () => {
    const newMealRequest = {
        time: "00:00",
        food: "Nova Refeição",
        foods: [],
    };
    try {
        const response = await fetch(`${API_BASE_URL}/api/medico/pacientes/addRefeicao`, {
            method: "POST",
            headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
            body: JSON.stringify({ newMeal: newMealRequest, pacienteEmail: pacienteEmail }),
        });
        if (!response.ok) throw new Error('Falha ao adicionar refeição');
        const planoAtualizado = await response.json();
        setMeals(planoAtualizado.meals);
    } catch (error) {
        alert(`Erro ao adicionar refeição: ${(error as Error).message}`);
    }
  };

  const removeMeal = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/medico/pacientes/removeRefeicao`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ refeicaoId: id }),
      });
      if (response.ok) {
        setMeals(meals.filter((meal) => meal.id !== id));
      } else {
        const result = await response.json();
        throw new Error(result.error || "Erro ao remover refeição");
      }
    } catch (error) {
      alert(`Erro ao remover refeição: ${(error as Error).message}`);
    }
  };

const updateMeal = async (id: number, field: keyof Meal, value: string) => {
    let refeicaoAtualizada: Meal | undefined;
    const novasRefeicoes = meals.map((meal) => {
      if (meal.id === id) {
        refeicaoAtualizada = { ...meal, [field]: value };
        return refeicaoAtualizada;
      }
      return meal;
    });
    setMeals(novasRefeicoes);
  
    if (refeicaoAtualizada) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`${API_BASE_URL}/api/refeicoes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          // CORREÇÃO: Enviamos as chaves corretas para o backend
          body: JSON.stringify({ tipo: refeicaoAtualizada.tipo, horario: refeicaoAtualizada.horario_sugerido })
        });
      } catch (error) {
        alert("Não foi possível salvar a alteração.");
      }
    }
  };

  const toggleMealExpansion = (mealId: number) => {
    setExpandedMeals((prev) => prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId]);
  };

  const handleAddFoodToMeal = async (foodToAdd: Food) => {
    if (selectedMealId === null) return;
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/medico/plano-alimentar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({
                refeicaoId: selectedMealId,
                foodToAdd: foodToAdd,
                pacienteEmail: pacienteEmail
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao adicionar alimento');
        }
        const planoAtualizado = await response.json();
        setMeals(planoAtualizado.meals);
        setShowFoodModal(false);
        setSelectedMealId(null);
    } catch (error) {
        alert(`Não foi possível adicionar o alimento. Erro: ${(error as Error).message}`);
    }
  };

  const handleRemoveFoodFromMeal = async (mealId: number, foodId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/alimentos/${foodId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao remover o alimento.');
      }
      setMeals(meals.map((meal) => meal.id === mealId ? { ...meal, foods: meal.foods.filter((f) => f.id !== foodId) } : meal));
      console.log(`Alimento ${foodId} removido com sucesso.`);
    } catch (error) {
      alert(`Não foi possível remover o alimento: ${(error as Error).message}`);
    }
  };

  // --- RENDERIZAÇÃO ---
  if (isLoading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh'}}><Loader2 size={48} className="animate-spin" /></div>;
  }

  return (
    <div className={styles.dashboard}>
      <main className={styles.mainContent}>
        <div className={styles.patientInfoCard}>
            <div className={styles.patientHeader}><span className={styles.patientTitle}>Cardápio: {pacienteInfo?.name || "Paciente"}</span></div>
            <div className={styles.patientDetails}>Paciente: {pacienteInfo?.name}, Telefone: {pacienteInfo?.phone}</div>
        </div>
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Rotina do Paciente</h2>
            <div className={styles.mealsContainer}>
                {meals.map((meal) => {
                    const mealTotals = calculateMealTotals(meal);
                    return (
                        <div key={meal.id} className={styles.mealRow}>
                            <div className={styles.mealControls}>
                                <input type="time" value={meal.horario_sugerido} onChange={(e) => updateMeal(meal.id, "horario_sugerido", e.target.value)} className={styles.timeInput} />
                                <select value={meal.tipo} onChange={(e) => updateMeal(meal.id, "tipo", e.target.value as string)} className={styles.foodSelect}>
                                    <option value="Café da manhã">Café da manhã</option>
                                    <option value="Almoço">Almoço</option>
                                    <option value="Jantar">Jantar</option>
                                    <option value="Lanche">Lanche</option>
                                    <option value="Ceia">Ceia</option>
                                    <option value="Nova Refeição">Nova Refeição</option>
                                </select>
                                <button className={styles.addFoodButton} onClick={() => { setSelectedMealId(meal.id); setShowFoodModal(true); }}>
                                    <span className="material-symbols-outlined">add</span> Adicionar Alimentos
                                </button>
                                <button className={styles.showFoodsButton} onClick={() => toggleMealExpansion(meal.id)}>
                                    <MdRestaurant />
                                    <span className={styles.arrow}>{expandedMeals.includes(meal.id) ? "▲" : "▼"}</span>
                                </button>
                                <Button label="" variant="danger" size="medium" icon={<span className="material-symbols-outlined">delete</span>} onClick={() => removeMeal(meal.id)} />
                            </div>
                            {expandedMeals.includes(meal.id) && (
                                <div className={styles.mealFoodsExpanded}>
                                    {meal.foods.length > 0 ? (
                                        meal.foods.map((food: any) => (
                                            <div key={food.id} className={styles.foodItem}>
                                                <div className={styles.foodInfo}>
                                                    <strong>{food.name_alimento}</strong>
                                                    <p>{food.quantity} &times; {food.chosen_serving?.serving_description || food.descricao_porcao || 'N/D'}</p>
                                                </div>
                                                <div className={styles.foodNutrition}>
                                                    <span>{(food.calculated_nutrition?.calories || food.calorias || 0).toFixed(0)} kcal</span>
                                                </div>
                                                <button className={styles.removeFoodButton} onClick={() => handleRemoveFoodFromMeal(meal.id, food.id)}>
                                                    <MdDelete />
                                                </button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className={styles.noFoodsMessage}><p>Nenhum alimento adicionado.</p></div>
                                    )}
                                    <div className={styles.mealTotals}>
                                        <strong>Total da Refeição:</strong>
                                        <span>{mealTotals.calories.toFixed(0)} kcal</span>
                                        <span>P: {mealTotals.protein.toFixed(1)}g</span>
                                        <span>C: {mealTotals.carbohydrate.toFixed(1)}g</span>
                                        <span>G: {mealTotals.fat.toFixed(1)}g</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <button onClick={addMeal} className={styles.addMealButton}>Nova Refeição</button>
            </div>
        </div>
        <div className={styles.analysis}>
            <h3 className={styles.analysisTitle}>Análise Nutricional Diária</h3>
            <div className={styles.analysisContent}>
                <div className={styles.table}>
                    {nutritionTableData.map((item, index) => (
                        <div key={index} className={styles.tableRow}><span>{item.nutrient}</span><span>{item.value}</span></div>
                    ))}
                </div>
                <div className={styles.chartContainer} style={{width: 220, height: 220}}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={nutritionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} onMouseEnter={onPieEnter} onMouseLeave={onPieLeave}>
                                {nutritionData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
        <div className={styles.dietSection}>
          <h2 className={styles.sectionTitle}>Complementos na Dieta</h2>
          <button className={styles.recipesButton} onClick={() => setShowRecipesModal(true)}>
            ••• Anexar Receitas
          </button>
        </div>
        <button className={styles.saveButton}>Salvar Alterações!</button>
        {showRecipesModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button className={styles.modalClose} onClick={() => setShowRecipesModal(false)}>✕</button>
              <RecipesApp />
            </div>
          </div>
        )}
        {showFoodModal && (
          <FoodPrescriptionModal onAddFood={handleAddFoodToMeal} onClose={() => { setShowFoodModal(false); setSelectedMealId(null); }} />
        )}
      </main>
    </div>
  );
};

export default NutriCareDashboard;
