// src/api/fatsecret.ts

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchFatSecretToken = async (): Promise<string> => {
  const response = await axios.get(`${API_BASE_URL}/fatsecret/token`);
  return response.data.access_token;
};

export const searchFoods = async (query: string, token: string) => {
  const response = await axios.post(`${API_BASE_URL}/api/fatsecret/search`, {
    query,
    token,
  });
  return response.data;
};
