import './PlanoAlimentar.css';
import { useState } from 'react';
import RotinaRefeicoes from '../../components/PlanoAlimentar/RotinaRefeicoes';
import AnaliseNutrientes from '../../components/PlanoAlimentar/AnaliseNutrientes';

const PlanoAlimentar = () => {
  const [nomeCardapio, setNomeCardapio] = useState('Max Maya');
  const [complementosVisiveis, setComplementosVisiveis] = useState(false);

  const dadosPaciente = {
    nome: 'Max Maya',
    telefone: '(13) 9299-999',
    data: '30/05/2025',
  };

  return (
    <div className="plano-container">
      {/* Cardápio + info */}
      <div className="cardapio-box">
        <label>Nome do Cardápio:</label>
        <input
          value={nomeCardapio}
          onChange={(e) => setNomeCardapio(e.target.value)}
        />
        <p className="cardapio-info">
          Paciente: {dadosPaciente.nome}, Telefone: {dadosPaciente.telefone}, Data: {dadosPaciente.data}
        </p>
      </div>

      {/* Rotina */}
      <RotinaRefeicoes />

      {/* Complementos */}
      <div className="section-box">
        <button onClick={() => setComplementosVisiveis(!complementosVisiveis)}>
          {complementosVisiveis ? 'Esconder Receitas' : 'Mostrar Receitas'}
        </button>
        {complementosVisiveis && <p style={{ marginTop: '10px' }}>Nenhuma receita adicionada ainda.</p>}
      </div>

      {/* Análise Nutricional */}
      <AnaliseNutrientes />

      {/* Botão */}
      <button className="save-button">Salvar Alterações!</button>
    </div>
  );
};

export default PlanoAlimentar;
