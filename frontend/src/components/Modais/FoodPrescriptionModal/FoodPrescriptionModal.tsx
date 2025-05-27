import React, { useEffect, useState } from "react";
import "./FoodPrescriptionModal.css";

type Food = {
  id: string;
  name: string;
};

interface FoodPrescriptionModalProps {
  foods: Food[];
  onRemove: (id: string) => void;
  onAdd: (food: Food) => void;  // nova prop para adicionar alimento
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

  useEffect(() => {
    const fetchToken = async () => {
      const clientId = "YOUR_CLIENT_ID";
      const clientSecret = "YOUR_CLIENT_SECRET";

      const res = await fetch("https://oauth.fatsecret.com/connect/token", {
        method: "POST",
        headers: {
          Authorization: "Basic " + btoa(`${clientId}:${clientSecret}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "grant_type=client_credentials&scope=basic",
      });

      const data = await res.json();
      setAccessToken(data.access_token);
    };

    fetchToken();
  }, []);

  const handleSearch = async () => {
    if (!searchTerm || !accessToken) return;

    const res = await fetch("https://platform.fatsecret.com/rest/server.api", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        method: "foods.search",
        format: "json",
        search_expression: searchTerm,
      }),
    });

    const data = await res.json();
    const results: Food[] =
      data.foods?.food?.map((item: any) => ({
        id: item.food_id.toString(),
        name: item.food_name,
      })) ?? [];

    setSearchResults(results);
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
            onChange={(e) => setSearchTerm(e.target.value)}
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
                    onAdd(food);         // chama a prop para adicionar no estado pai
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
