const axios = require('axios');
const qs = require('qs');

const CLIENT_ID = process.env.FATSECRET_CLIENT_ID;
const CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET;

exports.getFatSecretToken = async (req, res) => {
  try {
    const response = await axios.post('https://oauth.fatsecret.com/connect/token', 
      qs.stringify({
        grant_type: 'client_credentials',
        scope: 'basic',
      }), 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    res.json(response.data); // Envia access_token e expires_in
  } catch (error) {
    console.error('Erro ao obter token FatSecret:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao obter token FatSecret' });
  }
};

exports.searchFoods = async (req, res) => {
  const { query, token } = req.body;

  try {
    const response = await axios.get('https://platform.fatsecret.com/rest/server.api', {
      params: {
        method: 'foods.search',
        format: 'json',
        search_expression: query,
        oauth_consumer_key: CLIENT_ID
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
        console.error('--- ERRO DETALHADO AO BUSCAR ALIMENTOS DA FATSECRET ---');
        console.error('Status HTTP:', error.response?.status);
        console.error('Texto do Status:', error.response?.statusText);
        console.error('Dados da Resposta (possível erro da FatSecret):', JSON.stringify(error.response?.data, null, 2));
        console.error('Mensagem do Erro (Axios/JS):', error.message);
        console.error('Configuração da Requisição:', JSON.stringify(error.config, null, 2));
        console.error('--- FIM DO ERRO DETALHADO ---');

        let errorMessage = 'Erro ao buscar alimentos.';
        if (error.response?.data?.error) {
            errorMessage = `Erro da FatSecret: ${error.response.data.error.message || JSON.stringify(error.response.data.error)}`;
        } else if (error.response?.status) {
            errorMessage = `Erro HTTP ${error.response.status}: ${error.response.statusText}`;
        }

        res.status(error.response?.status || 500).json({ error: errorMessage });
  }
};

exports.getFoodDetails = async (req, res) => {
  // Pega o ID do alimento e o token enviados pelo frontend
  const { food_id, token } = req.body;

  if (!food_id || !token) {
    return res.status(400).json({ error: 'Food ID e token são obrigatórios.' });
  }

  try {
    // Faz a chamada para a API do FatSecret usando o método 'food.get.v2'
    const response = await axios.get('https://platform.fatsecret.com/rest/server.api', {
      params: {
        method: 'food.get.v2', // <-- Este é o método para obter detalhes
        food_id: food_id,
        format: 'json',
      },
      headers: {
        Authorization: `Bearer ${token}`, // Usa o mesmo token de autorização
      },
    });

    // A resposta da FatSecret para food.get.v2 vem dentro de uma chave "food"
    // Nós a enviamos diretamente para o frontend.
    res.json(response.data.food);

  } catch (error) {
    // Reutilizamos o seu excelente tratamento de erros
    console.error('--- ERRO DETALHADO AO BUSCAR DETALHES DO ALIMENTO ---');
    console.error('Status HTTP:', error.response?.status);
    console.error('Dados da Resposta:', JSON.stringify(error.response?.data, null, 2));
    console.error('Mensagem do Erro:', error.message);
    console.error('--- FIM DO ERRO DETALHADO ---');

    let errorMessage = 'Erro ao buscar detalhes do alimento.';
    if (error.response?.data?.error) {
      errorMessage = `Erro da FatSecret: ${error.response.data.error.message}`;
    }

    res.status(error.response?.status || 500).json({ error: errorMessage });
  }
};