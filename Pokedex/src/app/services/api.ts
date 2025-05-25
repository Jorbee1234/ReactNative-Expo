import axios from "axios";

export const api = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
});

export const fetchPoke = async (limit = 20, offset = 0) => {
  try {
    const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
    return response.data.results;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const fetchPokemonByName = async (name: string) => {
  try {
    const response = await api.get(`/pokemon/${name}`);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
