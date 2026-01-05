const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from the React client
app.use(express.static(path.join(__dirname, '../client/dist')));

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

app.get('/api/weather', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: 'City is required' });
        }

        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: city,
                units: 'metric',
                appid: API_KEY,
            },
        });

        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message });
        } else {
            res.status(500).json({ error: 'Failed to fetch weather data' });
        }
    }
});

app.get('/api/forecast', async (req, res) => {
    try {
        const { city } = req.query;
        if (!city) {
            return res.status(400).json({ error: 'City is required' });
        }

        const response = await axios.get(`${BASE_URL}/forecast`, {
            params: {
                q: city,
                units: 'metric',
                appid: API_KEY,
            },
        });

        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message });
        } else {
            res.status(500).json({ error: 'Failed to fetch forecast data' });
        }
    }
});

app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ error: 'Query is required' });
        }

        const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct`, {
            params: {
                q,
                limit: 5,
                appid: API_KEY,
            },
        });

        res.json(response.data);
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json({ error: error.response.data.message });
        } else {
            // Only log critical server errors if absolutely necessary, but kept minimal for production
            res.status(500).json({ error: 'Failed to search cities' });
        }
    }
});

// All other requests -> Serve React App
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
