import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import styles from "./FoodPrescriptionModal.module.css";
import { Search, X, Plus, ArrowLeft, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

// --- Hook de Debounce ---
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// --- Estruturas de Dados ---
export type ServingInfo = {
  serving_id: string;
  serving_description: string;
  metric_serving_unit: string;
  metric_serving_amount: number;
  calories: number;
  protein: number;
  carbohydrate: number;
  fat: number;
  fiber: number;
};

type FoodDetails = {
  food_id: string;
  food_name: string;
  servings: ServingInfo[];
};

export type Food = {
  id: string;
  api_food_id: string;
  name_alimento: string;
  quantity: number;
  chosen_serving: ServingInfo;
  calculated_nutrition: {
    calories: number;
    protein: number;
    carbohydrate: number;
    fat: number;
    fiber: number;
  };
};

// --- Props do Componente ---
interface FoodPrescriptionModalProps {
  onAddFood: (food: Food) => void;
  onClose: () => void;
}

//=========== O COMPONENTE FINAL ===========//
const FoodPrescriptionModal: React.FC<FoodPrescriptionModalProps> = ({
  onAddFood,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    { id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [selectedFoodDetails, setSelectedFoodDetails] =
    useState<FoodDetails | null>(null);
  const [servingChoice, setServingChoice] = useState({
    serving_id: "",
    quantity: 1,
  });
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const email = useParams<{ pacienteEmail: string }>();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/fatsecret/token"
        );
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error("Erro ao obter o token inicial:", error);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    const searchFood = async () => {
      if (debouncedSearchTerm.length < 3 || !accessToken) {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8080/api/fatsecret/search",
          {
            query: debouncedSearchTerm,
            token: accessToken,
          }
        );
        if (response.data.error) {
          setSearchResults([]);
        } else {
          const results =
            response.data.foods?.food?.map((item: any) => ({
              id: item.food_id,
              name: item.food_name,
            })) ?? [];
          setSearchResults(results);
        }
      } catch (error) {
        console.error("Erro na chamada de API de busca:", error);
      } finally {
        setLoading(false);
      }
    };
    searchFood();
  }, [debouncedSearchTerm, accessToken]);

  const handleSelectFoodFromSearch = async (food: {
    id: string;
    name: string;
  }) => {
    if (!accessToken) return;
    setLoading(true);
    setSearchResults([]);
    setSearchTerm(food.name);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/fatsecret/getFoodDetails",
        {
          food_id: food.id,
          token: accessToken,
        }
      );
      const rawDetails = response.data;
      let normalizedServings: ServingInfo[] = [];
      if (rawDetails.servings && rawDetails.servings.serving) {
        if (Array.isArray(rawDetails.servings.serving)) {
          normalizedServings = rawDetails.servings.serving;
        } else {
          normalizedServings = [rawDetails.servings.serving];
        }
      }
      const details: FoodDetails = {
        food_id: rawDetails.food_id,
        food_name: rawDetails.food_name,
        servings: normalizedServings,
      };
      setSelectedFoodDetails(details);
      if (details.servings && details.servings.length > 0) {
        setServingChoice({
          serving_id: details.servings[0].serving_id,
          quantity: 1,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do alimento", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalAdd = async () => {
    if (!selectedFoodDetails) return;
    const chosenServing = selectedFoodDetails.servings.find(
      (s) => s.serving_id === servingChoice.serving_id
    );
    if (!chosenServing) return;

    const calculatedNutrition = {
      calories: (Number(chosenServing.calories) || 0) * servingChoice.quantity,
      protein: (Number(chosenServing.protein) || 0) * servingChoice.quantity,
      carbohydrate:
        (Number(chosenServing.carbohydrate) || 0) * servingChoice.quantity,
      fat: (Number(chosenServing.fat) || 0) * servingChoice.quantity,
      fiber: (Number(chosenServing.fiber) || 0) * servingChoice.quantity,
    };

    const foodToAdd: Food = {
      id: crypto.randomUUID(),
      api_food_id: selectedFoodDetails.food_id,
      name_alimento: selectedFoodDetails.food_name,
      quantity: servingChoice.quantity,
      chosen_serving: chosenServing,
      calculated_nutrition: calculatedNutrition,
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/medico/plano-alimentar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ foodToAdd, pacienteEmail: email }),
        }
      );

      const result = await response.json();

      if (response.status == 201) {
        console.log("Alimenteo adicionado com sucesso!");
        console.log("result: ", result);
        onAddFood(foodToAdd);
        setSearchTerm("");
        setSelectedFoodDetails(null);
      }
    } catch (error) {}
  };

  const handleGoBackToSearch = () => {
    setSelectedFoodDetails(null);
    setSearchTerm("");
  };

  const previewNutrition = useMemo(() => {
    if (!selectedFoodDetails || !servingChoice.serving_id) return null;
    const chosenServing = selectedFoodDetails.servings.find(
      (s) => s.serving_id === servingChoice.serving_id
    );
    if (!chosenServing) return null;
    return {
      calories: (Number(chosenServing.calories) || 0) * servingChoice.quantity,
      protein: (Number(chosenServing.protein) || 0) * servingChoice.quantity,
      carbohydrate:
        (Number(chosenServing.carbohydrate) || 0) * servingChoice.quantity,
      fat: (Number(chosenServing.fat) || 0) * servingChoice.quantity,
      fiber: (Number(chosenServing.fiber) || 0) * servingChoice.quantity,
    };
  }, [selectedFoodDetails, servingChoice]);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          {selectedFoodDetails && (
            <button
              onClick={handleGoBackToSearch}
              className={styles.backButton}
              aria-label="Voltar para a busca"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className={styles.modalTitle}>
            {selectedFoodDetails
              ? `Adicionar ${selectedFoodDetails.food_name}`
              : "Buscar Alimento"}
          </h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Fechar modal"
          >
            <X size={24} />
          </button>
        </header>
        <main className={styles.modalBody}>
          {selectedFoodDetails ? (
            <div className={styles.servingSelectionUI}>
              <div className={styles.servingGrid}>
                <div className={styles.formGroup}>
                  <label htmlFor="serving">Porção</label>
                  <select
                    id="serving"
                    className={styles.selectInput}
                    value={servingChoice.serving_id}
                    onChange={(e) =>
                      setServingChoice({
                        ...servingChoice,
                        serving_id: e.target.value,
                      })
                    }
                  >
                    {selectedFoodDetails.servings.map((s) => (
                      <option key={s.serving_id} value={s.serving_id}>
                        {s.serving_description}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="quantity">Quantidade</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    className={styles.numberInput}
                    value={servingChoice.quantity}
                    onChange={(e) =>
                      setServingChoice({
                        ...servingChoice,
                        quantity: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              </div>

              {previewNutrition && (
                <div className={styles.nutritionPreview}>
                  <h4 className={styles.previewTitle}>
                    Valores Nutricionais (Estimado)
                  </h4>
                  <div className={styles.previewGrid}>
                    <div className={styles.previewItem}>
                      <span>Calorias</span>
                      <strong>
                        {previewNutrition.calories.toFixed(0)} kcal
                      </strong>
                    </div>
                    <div className={styles.previewItem}>
                      <span>Proteínas</span>
                      <strong>{previewNutrition.protein.toFixed(1)} g</strong>
                    </div>
                    <div className={styles.previewItem}>
                      <span>Carboidratos</span>
                      <strong>
                        {previewNutrition.carbohydrate.toFixed(1)} g
                      </strong>
                    </div>
                    <div className={styles.previewItem}>
                      <span>Gorduras</span>
                      <strong>{previewNutrition.fat.toFixed(1)} g</strong>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleFinalAdd}
                className={styles.confirmButton}
                style={{ marginTop: "1.5rem" }}
              >
                <Plus size={18} /> Adicionar ao Plano
              </button>
            </div>
          ) : (
            <div>
              <div className={styles.searchBox}>
                <Search size={20} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Busque por um alimento..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className={styles.searchResults}>
                {loading && (
                  <div className={styles.feedbackMessage}>
                    <Loader2 className={styles.spinner} /> Buscando...
                  </div>
                )}
                {!loading &&
                  searchResults.map((food) => (
                    <div
                      key={food.id}
                      className={styles.searchItem}
                      onClick={() => handleSelectFoodFromSearch(food)}
                    >
                      <span>{food.name}</span>
                      <Plus size={20} />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default FoodPrescriptionModal;
