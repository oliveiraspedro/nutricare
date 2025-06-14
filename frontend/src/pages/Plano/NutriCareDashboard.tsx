import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useParams } from "react-router-dom";
import styles from "./NutriCare.module.css";
import Button from "../../components/Button/Button";
import RecipesApp from "./components/RecipesApp/RecipesApp";
import FoodPrescriptionModal, {
  Food,
} from "./components/FoodPrescriptionModal/FoodPrescriptionModal";
import { MdRestaurant, MdDelete } from "react-icons/md";

// Tipagem para as Refeições (Meals)
type Meal = {
  id: number;
  time: string;
  food: string;
  additionalAlimentos: string;
  foods: Food[];
};

// Tipagem para as informações do paciente que virão da API
type PacienteInfo = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

const NutriCareDashboard = () => {
  const { pacienteEmail } = useParams<{ pacienteEmail: string }>();
  
  // Estados principais
  const [meals, setMeals] = useState<Meal[]>([]);
  const [pacienteInfo, setPacienteInfo] = useState<PacienteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para controle da UI (modais, expansão, etc.)
  const [showRecipesModal, setShowRecipesModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [expandedMeals, setExpandedMeals] = useState<number[]>([]);

  // Estados para os cálculos nutricionais e gráficos
  const [nutritionData, setNutritionData] = useState([
    { name: "Carboidratos", value: 0, color: "#4CAF50" },
    { name: "Proteínas", value: 0, color: "#1687C6" },
    { name: "Gorduras", value: 0, color: "#FFC107" },
  ]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);


  // EFEITO PRINCIPAL: BUSCAR OS DADOS DO PLANO ALIMENTAR NA API
  useEffect(() => {
    const fetchPlanoAlimentar = async () => {
      if (!pacienteEmail) return;

      setIsLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:8080/api/pacientes/${pacienteEmail}/plano-alimentar`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setPacienteInfo(data.pacienteInfo);
          setMeals(data.meals);
          console.log("Plano alimentar carregado:", data);
        } else {
          const errorData = await response.json();
          console.error("Erro ao carregar plano alimentar:", errorData.message);
          setMeals([]); // Garante que a lista de refeições esteja vazia em caso de erro
        }
      } catch (error) {
        console.error("Erro de rede ao carregar plano alimentar:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanoAlimentar();
  }, [pacienteEmail]);
  

  // EFEITO SECUNDÁRIO: ATUALIZAR OS CÁLCULOS QUANDO AS REFEIÇÕES MUDAM
  useEffect(() => {
    const totals = { calories: 0, protein: 0, carbohydrate: 0, fat: 0, fiber: 0 };

    // Loop para somar os totais
    meals.forEach((meal) => {
      meal.foods.forEach((food) => {
        // AQUI ESTÁ A CORREÇÃO: Usamos Number() em todas as somas
        totals.calories += Number(food.calculated_nutrition.calories) || 0;
        totals.protein += Number(food.calculated_nutrition.protein) || 0;
        totals.carbohydrate += Number(food.calculated_nutrition.carbohydrate) || 0;
        totals.fat += Number(food.calculated_nutrition.fat) || 0;
        totals.fiber += Number(food.calculated_nutrition.fiber) || 0;
      });
    });

    setTotalCalories(totals.calories);
    const totalMacroCalories = totals.protein * 4 + totals.carbohydrate * 4 + totals.fat * 9;

    if (totalMacroCalories > 0) {
      setNutritionData([
        { name: "Carboidratos", value: parseFloat((((totals.carbohydrate * 4) / totalMacroCalories) * 100).toFixed(1)), color: "#4CAF50" },
        { name: "Proteínas", value: parseFloat((((totals.protein * 4) / totalMacroCalories) * 100).toFixed(1)), color: "#1687C6" },
        { name: "Gorduras", value: parseFloat((((totals.fat * 9) / totalMacroCalories) * 100).toFixed(1)), color: "#FFC107" },
      ]);
    } else {
      setNutritionData([
        { name: "Carboidratos", value: 0, color: "#4CAF50" },
        { name: "Proteínas", value: 0, color: "#1687C6" },
        { name: "Gorduras", value: 0, color: "#FFC107" },
      ]);
    }
  }, [meals]);


  // FUNÇÕES AUXILIARES E HANDLERS
const calculateMealTotals = (meal: Meal) => {
  const mealTotals = { calories: 0, protein: 0, carbohydrate: 0, fat: 0 };
  meal.foods.forEach((food) => {
    // Garantimos que todos os valores são tratados como NÚMEROS antes da soma
    mealTotals.calories += Number(food.calculated_nutrition.calories) || 0;
    mealTotals.protein += Number(food.calculated_nutrition.protein) || 0;
    mealTotals.carbohydrate += Number(food.calculated_nutrition.carbohydrate) || 0;
    mealTotals.fat += Number(food.calculated_nutrition.fat) || 0;
  });
  return mealTotals;
};

  const onPieEnter = (_: any, index: number) => setSelectedSegment(index);
  const onPieLeave = () => setSelectedSegment(null);

  const addMeal = async () => {
    const newMeal: Omit<Meal, 'id'> = { // Usamos Omit para o ID temporário
        time: "00:00",
        food: "Café da manhã",
        additionalAlimentos: "",
        foods: [],
    };
    try {
        const response = await fetch("http://localhost:8080/api/medico/pacientes/addRefeicao", {
            method: "POST",
            headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
            body: JSON.stringify({ newMeal, pacienteEmail: pacienteEmail }),
        });
        
        if (!response.ok) {
            throw new Error('Falha ao adicionar refeição');
        }

        // A API agora retorna o plano completo
        const planoAtualizado = await response.json();
        
        // Simplesmente atualizamos o estado com os dados recebidos do backend
        setMeals(planoAtualizado.meals);

    } catch (error) {
        console.error("Erro ao adicionar refeição: ", error);
        alert("Erro ao adicionar refeição. Tente novamente.");
    }
};

  const removeMeal = async (id: number) => {
    try {
      const response = await fetch("http://localhost:8080/api/medico/pacientes/removeRefeicao", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ refeicaoId: id }),
      });
      const result = await response.json();
      if (response.ok) {
        setMeals(meals.filter((meal) => meal.id !== id));
        setExpandedMeals(expandedMeals.filter((mealId) => mealId !== id));
      } else {
        console.error("Erro ao remover refeição:", result.error);
      }
    } catch (error) {
      console.error("Erro ao remover refeição: ", error);
      alert("Erro ao remover refeição. Tente novamente.");
    }
  };

const updateMeal = async (id: number, field: keyof Meal, value: string) => {
  // 1. Atualiza o estado local para a UI ser rápida
  let refeicaoAtualizada: Meal | undefined;
  const novasRefeicoes = meals.map((meal) => {
    if (meal.id === id) {
      refeicaoAtualizada = { ...meal, [field]: value };
      return refeicaoAtualizada;
    }
    return meal;
  });
  setMeals(novasRefeicoes);

  // 2. Salva a alteração no backend (Autosave)
  if (refeicaoAtualizada) {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:8080/api/refeicoes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo: refeicaoAtualizada.food,
          horario: refeicaoAtualizada.time
        })
      });
      // Não precisamos fazer nada com a resposta, pois a UI já foi atualizada
      console.log(`Refeição ${id} atualizada no backend.`);
    } catch (error) {
      console.error("Falha ao salvar alteração da refeição:", error);
      // Opcional: reverter a mudança na UI ou mostrar um erro
      alert("Não foi possível salvar a alteração de horário/tipo.");
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
        const response = await fetch("http://localhost:8080/api/medico/plano-alimentar", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
            body: JSON.stringify({
                refeicaoId: selectedMealId,
                foodToAdd: foodToAdd,
                pacienteEmail: pacienteEmail // Enviando o email para o backend poder retornar a lista completa
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Falha ao adicionar alimento');
        }
        
        // A API agora retorna o plano completo
        const planoAtualizado = await response.json();
        
        // Simplesmente atualizamos o estado com os dados recebidos do backend
        setMeals(planoAtualizado.meals);

        // Limpamos e fechamos o modal
        setShowFoodModal(false);
        setSelectedMealId(null);

    } catch (error) {
        console.error("Erro ao adicionar alimento:", error);
        alert(`Não foi possível adicionar o alimento. Erro: ${(error as Error).message}`);
    }
};

const handleRemoveFoodFromMeal = async (mealId: number, foodId: string) => {
  // Opcional: Peça confirmação ao usuário
  // if (!window.confirm("Tem certeza que deseja remover este alimento?")) {
  //   return;
  // }

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/alimentos/${foodId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Falha ao remover o alimento.');
    }

    // Se o backend confirmou a exclusão, atualizamos o estado local
    setMeals(
      meals.map((meal) =>
        meal.id === mealId
          ? { ...meal, foods: meal.foods.filter((f) => f.id !== foodId) }
          : meal
      )
    );
    
    console.log(`Alimento ${foodId} removido com sucesso.`);

  } catch (error) {
    console.error("Erro ao remover o alimento:", error);
    alert(`Não foi possível remover o alimento: ${(error as Error).message}`);
  }
};

const nutritionTableData = useMemo(() => {
    const totals = { calories: 0, protein: 0, carbohydrate: 0, fat: 0, fiber: 0 };
    meals.forEach((meal) => {
        meal.foods.forEach((food) => {
            // Garantimos que todos os valores são tratados como números antes da soma
            totals.calories += Number(food.calculated_nutrition.calories) || 0;
            totals.protein += Number(food.calculated_nutrition.protein) || 0;
            totals.carbohydrate += Number(food.calculated_nutrition.carbohydrate) || 0;
            totals.fat += Number(food.calculated_nutrition.fat) || 0;
            totals.fiber += Number(food.calculated_nutrition.fiber) || 0;
        });
    });
    return [
      { nutrient: "Calorias totais", value: `${totals.calories.toFixed(0)}kcal` },
      { nutrient: "Proteínas totais", value: `${totals.protein.toFixed(1)}g` },
      { nutrient: "Lipídios totais", value: `${totals.fat.toFixed(1)}g` },
      { nutrient: "Carboidratos totais", value: `${totals.carbohydrate.toFixed(1)}g` },
      { nutrient: "Fibras totais", value: `${totals.fiber.toFixed(1)}g` },
    ];
  }, [meals]);


  // RENDERIZAÇÃO
  if (isLoading) {
    return <div className={styles.loading}>Carregando plano do paciente...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <main className={styles.mainContent}>
        <div className={styles.patientInfoCard}>
          <div className={styles.patientHeader}>
            <span className={styles.patientTitle}>Cardápio: {pacienteInfo?.name || "Paciente"}</span>
          </div>
          <div className={styles.patientDetails}>
            Paciente: {pacienteInfo?.name}, Telefone: {pacienteInfo?.phone}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Rotina do Paciente</h2>
          <div className={styles.mealsContainer}>
            {meals.map((meal) => {
              const mealTotals = calculateMealTotals(meal);
              return (
                <div key={meal.id} className={styles.mealRow}>
                  <div className={styles.mealControls}>
                    <input type="time" value={meal.time} onChange={(e) => updateMeal(meal.id, "time", e.target.value)} className={styles.timeInput} />
                    <select value={meal.food} onChange={(e) => updateMeal(meal.id, "food", e.target.value as string)} className={styles.foodSelect}>
                      <option value="Café da manhã">Café da manhã</option>
                      <option value="Almoço">Almoço</option>
                      <option value="Jantar">Jantar</option>
                      <option value="Lanche">Lanche</option>
                      <option value="Ceia">Ceia</option>
                    </select>
                    <button className={styles.addFoodButton} onClick={() => { setSelectedMealId(meal.id); setShowFoodModal(true); }}>
                      <span className="material-symbols-outlined">add</span>
                      Adicionar Alimentos
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
                        meal.foods.map((food) => (
                          <div key={food.id} className={styles.foodItem}>
                            <div className={styles.foodInfo}>
                              <strong>{food.name_alimento}</strong>
                              <p>{food.quantity} &times; {food.chosen_serving.serving_description}</p>
                            </div>
                            <div className={styles.foodNutrition}>
                              <span>{food.calculated_nutrition.calories.toFixed(0)} kcal</span>
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
                <div key={index} className={styles.tableRow}>
                  <span>{item.nutrient}</span>
                  <span>{item.value}</span>
                </div>
              ))}
            </div>
            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={nutritionData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} onMouseEnter={onPieEnter} onMouseLeave={onPieLeave}>
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