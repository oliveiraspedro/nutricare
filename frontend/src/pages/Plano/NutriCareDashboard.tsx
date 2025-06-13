import React, { useState, useEffect, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { useParams } from "react-router-dom";
import styles from "./NutriCare.module.css";
import Button from "../../components/Button/Button";
import RecipesApp from "./components/RecipesApp/RecipesApp";
import FoodPrescriptionModal, { Food } from "../../components/Modais/FoodPrescriptionModal/FoodPrescriptionModal";
import { MdRestaurant, MdDelete } from "react-icons/md";

type Meal = {
  id: number;
  time: string;
  food: string;
  additionalAlimentos: string;
  foods: Food[];
};

const NutriCareDashboard = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showRecipesModal, setShowRecipesModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [expandedMeals, setExpandedMeals] = useState<number[]>([]);
  
  const [nutritionData, setNutritionData] = useState([
    { name: "Carboidratos", value: 0, color: "#4CAF50" },
    { name: "Proteínas", value: 0, color: "#1687C6" },
    { name: "Gorduras", value: 0, color: "#FFC107" },
  ]);
  const [totalCalories, setTotalCalories] = useState(0);

  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);
  const email = useParams<{ pacienteEmail: string }>();

  useEffect(() => {
    const totals = {
      calories: 0,
      protein: 0,
      carbohydrate: 0,
      fat: 0,
      fiber: 0,
    };

    meals.forEach(meal => {
      meal.foods.forEach(food => {
        totals.calories += food.calculated_nutrition.calories;
        totals.protein += food.calculated_nutrition.protein;
        totals.carbohydrate += food.calculated_nutrition.carbohydrate;
        totals.fat += food.calculated_nutrition.fat;
        totals.fiber += food.calculated_nutrition.fiber;
      });
    });

    setTotalCalories(totals.calories);

    const totalMacroCalories = (totals.protein * 4) + (totals.carbohydrate * 4) + (totals.fat * 9);
    if (totalMacroCalories > 0) {
      setNutritionData([
        { name: "Carboidratos", value: parseFloat(((totals.carbohydrate * 4) / totalMacroCalories * 100).toFixed(1)), color: "#4CAF50" },
        { name: "Proteínas", value: parseFloat(((totals.protein * 4) / totalMacroCalories * 100).toFixed(1)), color: "#1687C6" },
        { name: "Gorduras", value: parseFloat(((totals.fat * 9) / totalMacroCalories * 100).toFixed(1)), color: "#FFC107" },
      ]);
    } else {
       setNutritionData([
        { name: "Carboidratos", value: 0, color: "#4CAF50" },
        { name: "Proteínas", value: 0, color: "#1687C6" },
        { name: "Gorduras", value: 0, color: "#FFC107" },
      ]);
    }

  }, [meals]);

  const calculateMealTotals = (meal: Meal) => {
    const mealTotals = { calories: 0, protein: 0, carbohydrate: 0, fat: 0 };
    meal.foods.forEach(food => {
      mealTotals.calories += food.calculated_nutrition.calories;
      mealTotals.protein += food.calculated_nutrition.protein;
      mealTotals.carbohydrate += food.calculated_nutrition.carbohydrate;
      mealTotals.fat += food.calculated_nutrition.fat;
    });
    return mealTotals;
  };

  const onPieEnter = (_: any, index: number) => setSelectedSegment(index);
  const onPieLeave = () => setSelectedSegment(null);

  const addMeal = async () => {
    const newMeal: Meal = {
      id: Date.now(),
      time: "00:00",
      food: "Café da manhã",
      additionalAlimentos: "",
      foods: [],
    };

    try {
      console.log("Paciente email: ", email.pacienteEmail);
      const response = await fetch(
        "http://localhost:8080/api/medico/pacientes/addRefeicao",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            newMeal,
            pacienteEmail: email.pacienteEmail,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(result.message);
        newMeal.id = result.meal.id;
        setMeals([...meals, newMeal]);
      } else {
        console.error("Erro ao adicionar refeição:", result.error);
      }
    } catch (error) {
      console.error("Erro ao adicionar refeição: ", error);
      alert("Erro ao adicionar refeição. Tente novamente.");
    }
  };

  const removeMeal = async (id: number) => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/medico/pacientes/removeRefeicao",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            refeicaoId: id,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log(result.message);
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

  const updateMeal = (id: number, field: keyof Meal, value: string) => {
    setMeals(
      meals.map((meal) => (meal.id === id ? { ...meal, [field]: value } : meal))
    );
  };
  
  const toggleMealExpansion = (mealId: number) => {
    setExpandedMeals((prev) =>
      prev.includes(mealId)
        ? prev.filter((id) => id !== mealId)
        : [...prev, mealId]
    );
  };

  const handleAddFoodToMeal = (foodToAdd: Food) => {
    if (selectedMealId === null) return;
    setMeals(
      meals.map((meal) =>
        meal.id === selectedMealId
          ? { ...meal, foods: [...meal.foods, foodToAdd] }
          : meal
      )
    );
    setShowFoodModal(false);
    setSelectedMealId(null);
  };

  const handleRemoveFoodFromMeal = (mealId: number, foodId: string) => {
    setMeals(
        meals.map((meal) =>
          meal.id === mealId
            ? { ...meal, foods: meal.foods.filter((f) => f.id !== foodId) }
            : meal
        )
    );
  };

  const nutritionTableData = useMemo(() => {
    const totals = { calories: 0, protein: 0, carbohydrate: 0, fat: 0, fiber: 0 };
    meals.forEach(meal => {
      meal.foods.forEach(food => {
        totals.calories += food.calculated_nutrition.calories;
        totals.protein += food.calculated_nutrition.protein;
        totals.carbohydrate += food.calculated_nutrition.carbohydrate;
        totals.fat += food.calculated_nutrition.fat;
        totals.fiber += food.calculated_nutrition.fiber;
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


  return (
    <div className={styles.dashboard}>
      <main className={styles.mainContent}>
        <div className={styles.patientInfoCard}>
          <div className={styles.patientHeader}>
            <span className={styles.patientTitle}>Cardápio: Max Maya</span>
          </div>
          <div className={styles.patientDetails}>
            Paciente: Max Maya, Telefone: (13)9999-999, Data: 30/05/2005
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
                    <input type="time" value={meal.time} onChange={(e) => updateMeal(meal.id, "time", e.target.value)} className={styles.timeInput}/>
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
                    <Button label="" variant="danger" size="medium" icon={<span className="material-symbols-outlined">delete</span>} onClick={() => removeMeal(meal.id)}/>
                  </div>

                  {expandedMeals.includes(meal.id) && (
                    <div className={styles.mealFoodsExpanded}>
                      {meal.foods.length > 0 ? (
                        meal.foods.map((food) => (
                          <div key={food.id} className={styles.foodItem}>
                            <div className={styles.foodInfo}>
                              <strong>{food.name}</strong>
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
                      ) : ( <div className={styles.noFoodsMessage}><p>Nenhum alimento adicionado.</p></div> )}
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
              )
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
          <FoodPrescriptionModal
            onAddFood={handleAddFoodToMeal}
            onClose={() => {
              setShowFoodModal(false);
              setSelectedMealId(null);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default NutriCareDashboard;