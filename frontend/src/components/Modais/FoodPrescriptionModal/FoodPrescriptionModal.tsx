import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FoodPrescriptionModal.css";

type Food = {
  id: string;
  name: string;
};

interface FoodPrescriptionModalProps {
  foods: Food[];
  onRemove: (id: string) => void;
  onAdd: (food: Food) => void;
  onClose: () => void;
}

const FoodPrescriptionModal: React.FC<FoodPrescriptionModalProps> = ({
  foods,
  onRemove,
  onAdd,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // 1. Busca o token do backend ao abrir o modal
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/fatsecret/token"
        );
        setAccessToken(response.data.access_token);
      } catch (error) {
        console.error("Erro ao obter token:", error);
      }
    };

    fetchToken();
  }, []);

  // 2. Faz a busca de alimentos chamando o backend
  const handleSearch = async () => {
    if (!searchTerm || !accessToken) return;

    try {
      const response = await axios.post(
        "http://localhost:8080/api/fatsecret/search",
        {
          query: searchTerm,
          token: accessToken,
        }
      );

      const data = response.data;
      console.log(
        "Resposta Bruta do Backend (para alimentos):",
        JSON.stringify(data, null, 2)
      );
      const results: Food[] =
        data.foods?.food?.map((item: any) => ({
          id: item.food_id.toString(),
          name: item.food_name,
        })) ?? [];

      results.map((food) => {
        console.log("food id: ", food.id);
        console.log("food name: ", food.name);
      });

      setSearchResults(results);
    } catch (error) {
      console.error("Erro ao buscar alimentos:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="close-button">
          <span>×</span>
        </button>

        <h2 className="modal-title">Buscador de Alimentos</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="Busque pelo nome do alimento ou nome da receita"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              console.log("searchTerm: ", searchTerm);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={() => setSearchTerm("")} className="clear-button">
            <span>×</span>
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map((food) => (
              <div key={food.id} className="food-item">
                <span>{food.name}</span>
                <button
                  onClick={() => {
                    onAdd(food);
                    setSearchResults([]);
                    setSearchTerm("");
                  }}
                  className="add-button"
                >
                  <span>+</span>
                </button>
              </div>
            ))}
          </div>
        )}

        <h3 className="prescribed-title">Alimentos prescritos</h3>
        <div className="prescribed-foods">
          {foods.length > 0 ? (
            foods.map((food) => (
              <div key={food.id} className="food-item">
                <span>{food.name}</span>
                <button
                  onClick={() => onRemove(food.id)}
                  className="remove-button"
                >
                  <span>×</span>
                </button>
              </div>
            ))
          ) : (
            <p className="empty-message">Nenhum alimento prescrito ainda.</p>
          )}
        </div>

        <button onClick={onClose} className="confirm-button">
          Confirmar e fechar!
        </button>
      </div>
    </div>
  );
};

export default FoodPrescriptionModal;
