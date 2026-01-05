import React, { useState, useEffect, useRef } from 'react';
import {
    Cloud, CloudRain, Sun, CloudSun, Wind, CloudLightning, CloudSnow,
    Moon, CloudMoon, Droplets, Thermometer, Gauge, Navigation
} from 'lucide-react';
import { getWeather, getForecast, searchCities } from './api/weatherService';
import WeatherError from './error';

export default function WeatherApp() {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showUnitsMenu, setShowUnitsMenu] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [tempUnit, setTempUnit] = useState('Celsius (°C)');
    const [windUnit, setWindUnit] = useState('km/h');
    const [precipUnit, setPrecipUnit] = useState('Millimeters (mm)');

    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const unitsMenuRef = useRef(null);
    const searchDropdownRef = useRef(null);
    const searchInputRef = useRef(null);

    const fetchWeather = async (city) => {
        try {
            setLoading(true);
            setError(null);
            setSuggestions([]);
            setShowSuggestions(false);
            const [weather, forecast] = await Promise.all([
                getWeather(city),
                getForecast(city)
            ]);
            setWeatherData(weather);
            setForecastData(forecast);
            setSearchQuery('');
        } catch (err) {
            setError('Failed to fetch weather data. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        // Clock interval
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);

        // IP-based Geolocation (No prompt)
        const detectLocation = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                if (data.city) {
                    fetchWeather(data.city);
                } else {
                    fetchWeather('Berlin');
                }
            } catch (error) {
                console.error("IP Geolocation failed:", error);
                fetchWeather('Berlin');
            }
        };

        detectLocation();

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.length > 2) {
                try {
                    const results = await searchCities(searchQuery);
                    setSuggestions(results);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Search failed", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (unitsMenuRef.current && !unitsMenuRef.current.contains(event.target)) {
                setShowUnitsMenu(false);
            }
            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }
            if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            fetchWeather(searchQuery);
        }
    };

    const handleSuggestionClick = (city, country) => {
        const query = `${city}, ${country}`;
        setSearchQuery(query);
        fetchWeather(query);
        setShowSuggestions(false);
    };

    // Helper to map weather condition to icon
    const getWeatherIcon = (main, iconCode) => {
        const isNight = iconCode && iconCode.endsWith('n');
        const props = { strokeWidth: 2.5 };

        switch (main) {
            case 'Clear':
                return isNight ? <Moon className="w-14 h-14 text-blue-200" {...props} /> : <Sun className="w-14 h-14 text-yellow-300" {...props} />;
            case 'Clouds':
                return isNight ? <CloudMoon className="w-14 h-14 text-gray-400" {...props} /> : <Cloud className="w-14 h-14 text-gray-300" {...props} />;
            case 'Rain':
            case 'Drizzle':
                return <CloudRain className="w-14 h-14 text-blue-300" {...props} />;
            case 'Thunderstorm':
                return <CloudLightning className="w-14 h-14 text-purple-300" {...props} />;
            case 'Snow':
                return <CloudSnow className="w-14 h-14 text-white" {...props} />;
            default:
                return isNight ? <CloudMoon className="w-14 h-14 text-gray-400" {...props} /> : <CloudSun className="w-14 h-14 text-orange-200" {...props} />;
        }
    };

    // Helper for small icons
    const getSmallIcon = (main, iconCode) => {
        const isNight = iconCode && iconCode.endsWith('n');
        const props = { strokeWidth: 2.5 };

        switch (main) {
            case 'Clear':
                return isNight ? <Moon className="w-7 h-7 text-blue-200" {...props} /> : <Sun className="w-7 h-7 text-yellow-300" {...props} />;
            case 'Clouds':
                return isNight ? <CloudMoon className="w-7 h-7 text-gray-400" {...props} /> : <Cloud className="w-7 h-7 text-gray-300" {...props} />;
            case 'Rain':
                return <CloudRain className="w-7 h-7 text-blue-300" {...props} />;
            default:
                return isNight ? <CloudMoon className="w-7 h-7 text-gray-400" {...props} /> : <CloudSun className="w-7 h-7 text-orange-200" {...props} />;
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    };

    // Unit Conversion Helpers
    const getTemp = (celsius) => {
        if (tempUnit === 'Fahrenheit (°F)') {
            return Math.round((celsius * 9 / 5) + 32);
        }
        return Math.round(celsius);
    };

    const getWind = (speedKmh) => {
        // API returns m/s (metric). Need to check if it's m/s or km/h from our service.
        // openweather metric returns m/s. So we treat input as m/s first.
        // Actually earlier code assumed km/h but sent units=metric (m/s).
        // Let's assume input is m/s.
        // 1 m/s = 3.6 km/h.
        const speedKmhVal = speedKmh * 3.6;

        if (windUnit === 'mph') {
            return Math.round(speedKmhVal * 0.621371);
        }
        return Math.round(speedKmhVal); // Default to km/h
    };

    const getPrecip = (mm) => {
        if (precipUnit === 'Inches (in)') { // If we ever added inches
            return (mm * 0.0393701).toFixed(2);
        }
        return mm ? mm : 0;
    }

    if (loading) return <div className="min-h-screen bg-indigo-950 flex items-center justify-center text-white text-2xl">Loading...</div>;
    if (error) return <WeatherError message={error} onRetry={() => fetchWeather('Berlin')} />;
    if (!weatherData || !forecastData) return null; // Restore standard behavior

    // Process forecast for hourly (next 8 segments = 24h)
    const hourlyData = forecastData.list.slice(0, 8).map(item => ({
        time: formatTime(item.dt),
        temp: `${getTemp(item.main.temp)}°`,
        icon: getSmallIcon(item.weather[0].main, item.weather[0].icon)
    }));

    // Process forecast for daily (Aggregation)
    const dailyData = [];
    const groupedData = {};

    // Group by Date
    forecastData.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!groupedData[date]) {
            groupedData[date] = [];
        }
        groupedData[date].push(item);
    });

    // Calculate High/Low for each day (Take first 5 days)
    Object.keys(groupedData).slice(0, 5).forEach(date => {
        const readings = groupedData[date];
        const minTemp = Math.min(...readings.map(r => r.main.temp_min));
        const maxTemp = Math.max(...readings.map(r => r.main.temp_max));
        // Take the icon from mid-day (approx index 4 or middle)
        const midItem = readings[Math.floor(readings.length / 2)];

        dailyData.push({
            name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
            icon: getWeatherIcon(midItem.weather[0].main, midItem.weather[0].icon),
            high: `${getTemp(maxTemp)}°`,
            low: `${getTemp(minTemp)}°`
        });
    });


    return (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 text-white p-4 overflow-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition" onClick={() => window.location.reload()}>
                    <Sun className="w-8 h-8 md:w-10 md:h-10 text-orange-400" strokeWidth={2.5} />
                    <h1 className="text-xl md:text-2xl font-bold">Weather Now</h1>
                </div>
                <div className="relative" ref={unitsMenuRef}>
                    <button
                        onClick={() => setShowUnitsMenu(!showUnitsMenu)}
                        className="flex items-center gap-2 bg-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                    >
                        <span>⚙️</span>
                        <span>Units</span>
                        <span>▼</span>
                    </button>

                    {showUnitsMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-gray-600 rounded-xl shadow-xl overflow-hidden z-50">

                            <div className="py-2">
                                <p className="px-4 py-1 text-xs text-gray-300">Temperature</p>
                                <button
                                    onClick={() => { setTempUnit('Celsius (°C)'); setShowUnitsMenu(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 bg-gray-600 flex justify-between items-center text-white"
                                >
                                    <span>Celsius (°C)</span>
                                    {tempUnit === 'Celsius (°C)' && <span>✓</span>}
                                </button>
                                <button
                                    onClick={() => { setTempUnit('Fahrenheit (°F)'); setShowUnitsMenu(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 bg-gray-600 flex justify-between items-center text-white"
                                >
                                    <span>Fahrenheit (°F)</span>
                                    {tempUnit === 'Fahrenheit (°F)' && <span>✓</span>}
                                </button>
                            </div>

                            <div className="py-2">
                                <p className="px-4 py-1 text-xs text-gray-300">Wind Speed</p>
                                <button
                                    onClick={() => { setWindUnit('km/h'); setShowUnitsMenu(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 bg-gray-600 flex justify-between items-center text-white"
                                >
                                    <span>km/h</span>
                                    {windUnit === 'km/h' && <span>✓</span>}
                                </button>
                                <button
                                    onClick={() => { setWindUnit('mph'); setShowUnitsMenu(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 bg-gray-600 flex justify-between items-center text-white"
                                >
                                    <span>mph</span>
                                    {windUnit === 'mph' && <span>✓</span>}
                                </button>
                            </div>

                            <div className="py-2">
                                <p className="px-4 py-1 text-xs text-gray-300">Precipitation</p>
                                <button
                                    onClick={() => { setPrecipUnit('Millimeters (mm)'); setShowUnitsMenu(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 bg-gray-600 flex justify-between items-center text-white"
                                >
                                    <span>Millimeters (mm)</span>
                                    {precipUnit === 'Millimeters (mm)' && <span>✓</span>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-8 md:mb-12">How's the sky looking today?</h2>

            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8 md:mb-12 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative" ref={searchDropdownRef}>
                    <div className="bg-indigo-900/50 rounded-xl px-6 py-4 flex items-center">
                        <span className="mr-3">🔍</span>
                        <input
                            type="text"
                            placeholder="Search for a place..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSearchDropdown(true);
                            }}
                            onFocus={() => setShowSearchDropdown(true)}
                            className="bg-transparent outline-none flex-1 text-white placeholder-indigo-300"
                        />
                    </div>

                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full mt-2 w-full rounded-xl shadow-xl overflow-hidden z-50 bg-gray-800" ref={searchInputRef}>
                            {suggestions.map((place, index) => (
                                <button
                                    key={`${place.lat}-${place.lon}-${index}`}
                                    type="button"
                                    onClick={() => handleSuggestionClick(place.name, place.country)}
                                    className="w-full text-left px-6 py-3 hover:bg-gray-700 bg-gray-800 transition text-white border-b border-gray-700 last:border-0"
                                >
                                    <span className="font-bold">{place.name}</span>
                                    <span className="text-gray-400 text-sm ml-2">
                                        {place.state ? `${place.state}, ` : ''}{place.country}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button type="submit" className="bg-indigo-600 px-8 py-4 rounded-xl hover:bg-indigo-500 transition font-semibold">
                    Search
                </button>
            </form>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                {/* Current Weather Card */}
                <div className="lg:col-span-2 bg-blue-500/40 from-indigo-600 to-indigo-800 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between">

                    <div className="relative z-10">
                        <div className="flex flex-col md:block text-center md:text-left">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2">{weatherData.name}, {weatherData.sys.country}</h3>
                            <p className="text-indigo-200 mb-2">{formatDate(weatherData.dt)}</p>
                            <p className="text-indigo-300 mb-8 font-mono text-lg opacity-80">{currentTime.toLocaleTimeString()}</p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                            <div className="transform scale-100 md:scale-125 origin-center md:origin-left md:ml-4">
                                {getWeatherIcon(weatherData.weather[0].main, weatherData.weather[0].icon)}
                            </div>
                            <div className="text-7xl md:text-9xl font-bold">{getTemp(weatherData.main.temp)}°</div>
                        </div>
                        <p className="italic text-lg md:text-xl mt-4 font-semibold text-indigo-100 uppercase tracking-widest text-center md:text-left">{weatherData.weather[0].description}</p>
                    </div>
                    {/* Weather Details */}
                    <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                        <div className="bg-indigo-900/50 rounded-2xl hover:bg-indigo-800/50 p-4 transition flex flex-col items-center text-center">
                            <Thermometer className="w-6 h-6 text-orange-400 mb-2" strokeWidth={2.5} />
                            <p className="text-indigo-300 text-sm mb-1 font-semibold">Feels Like</p>
                            <p className="text-2xl font-bold">{getTemp(weatherData.main.feels_like)}°</p>
                        </div>
                        <div className="bg-indigo-900/50 rounded-2xl hover:bg-indigo-800/50 p-4 transition flex flex-col items-center text-center">
                            <Droplets className="w-6 h-6 text-blue-400 mb-2" strokeWidth={2.5} />
                            <p className="text-indigo-300 text-sm mb-1 font-semibold">Humidity</p>
                            <p className="text-2xl font-bold">{weatherData.main.humidity}%</p>
                        </div>
                        <div className="bg-indigo-900/50 rounded-2xl hover:bg-indigo-800/50 p-4 transition flex flex-col items-center text-center">
                            <Wind className="w-6 h-6 text-green-400 mb-2" strokeWidth={2.5} />
                            <p className="text-indigo-300 text-sm mb-1 font-semibold">Wind</p>
                            <p className="text-2xl font-bold">{getWind(weatherData.wind.speed)}</p>
                            <p className="text-xs text-indigo-400 font-bold">{windUnit}</p>
                        </div>
                        <div className="bg-indigo-900/50 rounded-2xl hover:bg-indigo-800/50 p-4 transition flex flex-col items-center text-center">
                            <Navigation className="w-6 h-6 text-purple-400 mb-2" strokeWidth={2.5} />
                            <p className="text-indigo-300 text-sm mb-1 font-semibold">Precipitation</p>
                            <p className="text-2xl font-bold">{getPrecip(weatherData.rain ? weatherData.rain['1h'] : 0)}</p>
                            <p className="text-xs text-indigo-400 font-bold">mm</p>
                        </div>
                    </div>
                </div>

                {/* Hourly Forecast */}
                <div className="bg-indigo-900/50 rounded-3xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Hourly forecast</h3>
                        {/* Day Dropdown Removed as it was non-functional */}
                    </div>

                    <div className="space-y-3">
                        {hourlyData.map((hour, index) => (
                            <div key={index} className="flex items-center justify-between bg-indigo-800/50 hover:bg-indigo-600/50 rounded-xl p-4 transition group">
                                <div className="flex items-center gap-3">
                                    <div className="group-hover:scale-110 transition-transform">
                                        {hour.icon}
                                    </div>
                                    <span className="font-semibold">{hour.time}</span>
                                </div>
                                <span className="font-bold text-lg">{hour.temp}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Daily Forecast */}
                <div className="lg:col-span-3">
                    <h3 className="text-2xl font-bold mb-4">Daily forecast</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {dailyData.map((day, index) => (
                            <div key={index} className={`bg-indigo-900/50 rounded-2xl p-3 text-center hover:bg-indigo-800/50 transition cursor-pointer group glass-card ${index === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
                                <p className="font-bold text-xl mb-1 text-indigo-200">{day.name}</p>
                                <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">
                                    {day.icon}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-3xl font-bold">{day.high}</p>
                                    <p className="text-lg text-indigo-400 font-bold">L: {day.low}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
