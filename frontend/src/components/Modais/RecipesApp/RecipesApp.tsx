import React, { useState } from 'react';
import './RecipesApp.css';

const RecipesApp = () => {
  const [recipes, setRecipes] = useState([
    { id: 1, name: 'Almôndegas de grão-de-bico', description: '', expanded: false, attached: false },
    { id: 2, name: 'Arroz ao forno com espinafre', description: '', expanded: false, attached: false },
    { id: 3, name: 'Assado ao alecrim', description: '', expanded: false, attached: false },
    { id: 4, name: 'Atum selado na crosta de gergelim', description: '', expanded: false, attached: false },
    { id: 5, name: 'Bacalhoada', description: '', expanded: false, attached: false },
    { id: 6, name: 'Badejo com tomate e alho-poró', description: '', expanded: false, attached: false }
  ]);

  const [newRecipe, setNewRecipe] = useState('');
  const [newDescription, setNewDescription] = useState('');
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
        description: newDescription.trim(),
        expanded: false,
        attached: true
      }]);
      setNewRecipe('');
      setNewDescription('');
      setShowAddForm(false);
    }
  };

  const removeRecipe = (id: number) => {
    setRecipes(recipes.filter(recipe => recipe.id !== id));
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setNewRecipe('');
    setNewDescription('');
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
                  <span className="material-symbols-outlined expand-icon">
                    {recipe.expanded ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>

              {recipe.expanded && (
                <div className="recipe-details">
                  {recipe.description ? (
                    <div className="recipe-description">
                      <h4>Descrição:</h4>
                      <p style={{ 
                        wordWrap: 'break-word', 
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.4',
                        marginBottom: '10px'
                      }}>
                        {recipe.description}
                      </p>
                    </div>
                  )  : (
                    <p>Detalhes da receita "{recipe.name}" apareceriam aqui.</p>
                  )}
                  {/* <p className="recipe-sub">Ingredientes, modo de preparo, tempo de cozimento, etc.</p>*/}
                  
                  {/* Delete Button */}
                  <div className="recipe-actions">
                    <button
                      onClick={() => removeRecipe(recipe.id)}
                      className="btn btn-delete"
                    >
                      Remover receita
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Recipe */}
        {showAddForm ? (
          <div className="add-form">
            <div className="input-group">
              <label>Nome da receita</label>
              <input
                type="text"
                value={newRecipe}
                onChange={(e) => setNewRecipe(e.target.value)}
                placeholder="Nome da nova receita..."
                className="add-input"
                onKeyPress={(e) => e.key === 'Enter' && addRecipe()}
                autoFocus
              />
            </div>
            
            <div className="input-group">
              <label>Descrição</label>
              <textarea 
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Descrição da receita, ingredientes especiais, observações..."
                rows={3}
                className="add-textarea"
                style={{ resize: 'none' }}
              />
            </div>
            
            <div className="add-buttons">
              <button onClick={addRecipe} className="btn btn-primary">Adicionar</button>
              <button onClick={cancelAdd} className="btn btn-secondary">Cancelar</button>
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