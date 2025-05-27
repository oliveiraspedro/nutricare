import React, { useState } from 'react';
import './RecipesApp.css';

const RecipesApp = () => {
  const [recipes, setRecipes] = useState([
    { id: 1, name: 'Almôndegas de grão-de-bico', expanded: false, attached: true },
    { id: 2, name: 'Arroz ao forno com espinafre', expanded: false, attached: true },
    { id: 3, name: 'Assado ao alecrim', expanded: false, attached: true },
    { id: 4, name: 'Atum selado na crosta de gergelim', expanded: false, attached: true },
    { id: 5, name: 'Bacalhoada', expanded: false, attached: true },
    { id: 6, name: 'Badejo com tomate e alho-poró', expanded: false, attached: true }
  ]);

  const [newRecipe, setNewRecipe] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleRecipe = (id: number) => {
    setRecipes(recipes.map(recipe =>
      recipe.id === id ? { ...recipe, expanded: !recipe.expanded } : recipe
    ));
  };

  const toggleAttached = (id: number) => {
    setRecipes(recipes.map(recipe =>
      recipe.id === id ? { ...recipe, attached: !recipe.attached } : recipe
    ));
  };

  const addRecipe = () => {
    if (newRecipe.trim()) {
      const newId = Math.max(...recipes.map(r => r.id)) + 1;
      setRecipes([...recipes, {
        id: newId,
        name: newRecipe.trim(),
        expanded: false,
        attached: true
      }]);
      setNewRecipe('');
      setShowAddForm(false);
    }
  };

  const removeRecipe = (id: number) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const attachedCount = recipes.filter(r => r.attached).length;

  return (
    <div className="app-container">
      <div className="app-box">
        {/* Header */}
        <div className="app-header">
          <span className="material-symbols-outlined icon">restaurant_menu</span>
          <h1>Anexar receitas culinárias</h1>
        </div>

        {/* Recipes List */}
        <div className="recipe-list">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="recipe-item">
              <div className="recipe-header" onClick={() => toggleRecipe(recipe.id)}>
                <div className="recipe-left">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleAttached(recipe.id);
                    }}
                    className={`check-button ${recipe.attached ? 'checked' : ''}`}
                  >
                    {recipe.attached && <span className="material-symbols-outlined">check</span>}
                  </button>
                  <span className="recipe-name">{recipe.name}</span>
                </div>
                <div className="recipe-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecipe(recipe.id);
                    }}
                    className="close-button"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                  <span className="material-symbols-outlined expand-icon">
                    {recipe.expanded ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>

              {recipe.expanded && (
                <div className="recipe-details">
                  <p>Detalhes da receita "{recipe.name}" apareceriam aqui.</p>
                  <p className="recipe-sub">Ingredientes, modo de preparo, tempo de cozimento, etc.</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Recipe */}
        {showAddForm ? (
          <div className="add-form">
            <input
              type="text"
              value={newRecipe}
              onChange={(e) => setNewRecipe(e.target.value)}
              placeholder="Nome da nova receita..."
              className="add-input"
              onKeyPress={(e) => e.key === 'Enter' && addRecipe()}
              autoFocus
            />
            <div className="add-buttons">
              <button onClick={addRecipe} className="btn btn-primary">Adicionar</button>
              <button onClick={() => { setShowAddForm(false); setNewRecipe(''); }} className="btn btn-secondary">Cancelar</button>
            </div>
          </div>
        ) : (
          <button onClick={() => setShowAddForm(true)} className="btn btn-add">
            <span className="material-symbols-outlined">add</span>
            Adicionar nova receita
          </button>
        )}

        {/* Confirm Button */}
        <button className="btn btn-confirm">Confirmar e fechar!</button>

        {/* Status */}
        <div className="status">
          <p>{attachedCount} de {recipes.length} receitas anexadas</p>
        </div>
      </div>
    </div>
  );
};

export default RecipesApp;
