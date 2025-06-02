import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import styles from "./NutriCare.module.css";
import Button from "../../../src/components/Button/Button";
import RecipesApp from "../../components/Modais/RecipesApp/RecipesApp";
import FoodPrescriptionModal from "../../components/Modais/FoodPrescriptionModal/FoodPrescriptionModal";

const NutriCareDashboard = () => {
  const [meals, setMeals] = useState([
    { id: 1, time: "00:00", food: "Café da manhã", additionalAlimentos: "" },
    { id: 2, time: "00:00", food: "Café da manhã", additionalAlimentos: "" },
    { id: 3, time: "00:00", food: "Café da manhã", additionalAlimentos: "" },
  ]);

  const [showRecipesModal, setShowRecipesModal] = useState(false);
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [selectedMealId, setSelectedMealId] = useState<number | null>(null);
  const [prescribedFoods, setPrescribedFoods] = useState<any[]>([]);

  const nutritionData = [
    { name: "Proteínas", value: 44.86, color: "#1687C6" },
    { name: "Carboidratos", value: 27.0, color: "#4CAF50" },
    { name: "Fibras", value: 27.0, color: "#FF6B6B" },
    { name: "Lipídios", value: 27.0, color: "#FFC107" },
  ];

  const [selectedSegment, setSelectedSegment] = useState<number | null>(null);

  const onPieEnter = (_: any, index: number) => {
    setSelectedSegment(index);
  };

  const onPieLeave = () => {
    setSelectedSegment(null);
  };

  const nutritionTable = [
    { nutrient: "Proteínas totais", value: "76.5g" },
    { nutrient: "Lipídios totais", value: "76.7g" },
    { nutrient: "Carboidratos totais", value: "76.3g" },
    { nutrient: "Fibras totais", value: "76.7g" },
    { nutrient: "Calorias totais", value: "76.7g" },
  ];

  const addMeal = () => {
    const newMeal = {
      id: Date.now(),
      time: "00:00",
      food: "Café da manhã",
      additionalAlimentos: "",
    };
    setMeals([...meals, newMeal]);
  };

  const removeMeal = (id: number) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  const updateMeal = (
    id: number,
    field: keyof (typeof meals)[0],
    value: string
  ) => {
    setMeals(
      meals.map((meal) => (meal.id === id ? { ...meal, [field]: value } : meal))
    );
  };

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
            {meals.map((meal) => (
              <div key={meal.id} className={styles.mealRow}>
                <input
                  type="time"
                  value={meal.time}
                  onChange={(e) => updateMeal(meal.id, "time", e.target.value)}
                  className={styles.timeInput}
                />

                <select
                  value={meal.food}
                  onChange={(e) => updateMeal(meal.id, "food", e.target.value)}
                  className={styles.foodSelect}
                >
                  <option value="Café da manhã">Café da manhã</option>
                  <option value="Almoço">Almoço</option>
                  <option value="Jantar">Jantar</option>
                  <option value="Lanche">Lanche</option>
                  <option value="Ceia">Ceia</option>
                </select>

                <button
                  className={styles.addFoodButton}
                  onClick={() => {
                    setSelectedMealId(meal.id);
                    setShowFoodModal(true);
                  }}
                >
                  <span className="material-symbols-outlined">add</span>
                  Adicionar Alimentos
                </button>

                <Button
                  label=""
                  variant="danger"
                  size="medium"
                  icon={<span className="material-symbols-outlined">delete</span>}
                  onClick={() => removeMeal(meal.id)}
                />
              </div>
            ))}

            <button onClick={addMeal} className={styles.addMealButton}>
              Nova Refeição
            </button>
          </div>
        </div>

        <div className={styles.dietSection}>
          <h2 className={styles.sectionTitle}>Complementos na Dieta</h2>
          <button
            className={styles.recipesButton}
            onClick={() => setShowRecipesModal(true)}
          >
            ••• Anexar Receitas
          </button>
        </div>

        <div className={styles.analysis}>
          <h3 className={styles.analysisTitle}>
            Análise de Nutrientes do cardápio
          </h3>
          <div className={styles.analysisContent}>
            <div className={styles.table}>
              <div className={styles.tableHeader}>por/100ml</div>
              {nutritionTable.map((item, index) => (
                <div key={index} className={styles.tableRow}>
                  <span className={styles.nutrientName}>{item.nutrient}</span>
                  <span className={styles.nutrientValue}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className={styles.chartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nutritionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={selectedSegment !== null ? 85 : 80}
                    paddingAngle={5}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {nutritionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke={selectedSegment === index ? "#243B53" : "none"}
                        strokeWidth={selectedSegment === index ? 2 : 0}
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={50}
                    formatter={(value, entry) => {
                      const payload = entry?.payload;
                      if (
                        typeof payload === "object" &&
                        payload !== null &&
                        "color" in payload &&
                        "value" in payload
                      ) {
                        const color = (payload as { color: string }).color;
                        const val = (payload as { value: number }).value;
                        return (
                          <span
                            style={{
                              color,
                              fontSize: "12px",
                              fontWeight:
                                selectedSegment ===
                                nutritionData.findIndex(
                                  (item) => item.name === value
                                )
                                  ? "bold"
                                  : "normal",
                            }}
                          >
                            {value} - {val}%
                          </span>
                        );
                      }
                      return <span>{value}</span>;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {selectedSegment !== null && (
                <div className={styles.chartInfo}>
                  <h4>{nutritionData[selectedSegment].name}</h4>
                  <p>Valor: {nutritionData[selectedSegment].value}%</p>
                  <p>
                    Total em gramas:{" "}
                    {(nutritionData[selectedSegment].value * 0.765).toFixed(1)}g
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <button className={styles.saveButton}>Salvar Alterações!</button>

        {/* Modal de Receitas */}
        {showRecipesModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button
                className={styles.modalClose}
                onClick={() => setShowRecipesModal(false)}
              >
                ✕
              </button>
              <RecipesApp />
            </div>
          </div>
        )}

        {/* Modal de Adicionar Alimentos */}
        {showFoodModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <button
                className={styles.modalClose}
                onClick={() => setShowFoodModal(false)}
              >
                ✕
              </button>
              <FoodPrescriptionModal
                foods={prescribedFoods}
                onAdd={(newFood) => setPrescribedFoods(prev => [...prev, newFood])}
                onRemove={(id) => setPrescribedFoods(prev => prev.filter(f => f.id !== id))}
                onClose={() => setShowFoodModal(false)}
              />

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default NutriCareDashboard;
