import axios from 'axios';

const API_URL = '/api';

// get weather by city (string) or coords ({ lat, lon })
export const getWeather = async (query) => {
    try {
        const params = typeof query === 'string' ? { city: query } : { lat: query.lat, lon: query.lon };
        const response = await axios.get(`${API_URL}/weather`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getForecast = async (query) => {
    try {
        const params = typeof query === 'string' ? { city: query } : { lat: query.lat, lon: query.lon };
        const response = await axios.get(`${API_URL}/forecast`, { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const searchCities = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/search`, {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
