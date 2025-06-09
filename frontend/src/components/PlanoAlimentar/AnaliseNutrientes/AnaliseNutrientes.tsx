import './AnaliseNutrientes.css';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const AnaliseNutrientes = () => {
  const data = [
    { name: 'Proteína', value: 60 },
    { name: 'Carboidrato', value: 150 },
    { name: 'Lipídios', value: 70 },
    { name: 'Outros', value: 30 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="analise-container">
      <h2 className="analise-header">Análise de Nutrientes do Cardápio</h2>

      <table className="analise-table">
        <thead>
          <tr>
            <th>Parâmetro</th>
            <th>Prescrição</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Calorias</td><td>2000 kcal</td></tr>
          <tr><td>Proteínas</td><td>120g</td></tr>
          <tr><td>Carboidratos</td><td>300g</td></tr>
          <tr><td>Lipídios</td><td>70g</td></tr>
        </tbody>
      </table>

      <div className="chart-wrapper">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={80} label>
              {data.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnaliseNutrientes;
