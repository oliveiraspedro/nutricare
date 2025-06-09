const axios = require('axios');
const qs = require('qs');

const CLIENT_ID = process.env.FATSECRET_CLIENT_ID || 'c35c4e743d47433791233bc78b73a727';
const CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET || 'b889f6ac8ed84d24b3b912deebfab6cf';

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
        search_expression: query
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao buscar alimentos:', error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao buscar alimentos' });
  }
};
