import './RotinaRefeicoes.css';

const RotinaRefeicoes = () => {
  return (
    <div className="rotina-container">
      <h2 className="rotina-header">Rotina do Paciente</h2>

      {/* Simulação de uma refeição */}
      <div className="refeicao-item">
        <input className="refeicao-input" placeholder="00:00" />
        <input className="refeicao-input" placeholder="Café da manhã" />
        <div className="refeicao-nutrientes">
          <span>Proteína: 20g</span>
          <span>Carbo: 30g</span>
          <span>Gordura: 10g</span>
        </div>
        <div className="refeicao-btns">
          <button>🍽️</button>
          <button>🗑️</button>
        </div>
      </div>

      <button className="nova-refeicao-btn">Nova Refeição</button>
    </div>
  );
};

export default RotinaRefeicoes;
