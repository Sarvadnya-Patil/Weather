import React, { useState, useEffect, useRef } from 'react';
import { Cloud, CloudRain, Sun, CloudSun, Wind } from 'lucide-react';

export default function WeatherApp() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDay, setSelectedDay] = useState('Tuesday');
    const [showUnitsMenu, setShowUnitsMenu] = useState(false);
    const [showSearchDropdown, setShowSearchDropdown] = useState(false);
    const [showDayDropdown, setShowDayDropdown] = useState(false);
    const [tempUnit, setTempUnit] = useState('Celsius (°C)');
    const [windUnit, setWindUnit] = useState('km/h');
    const [precipUnit, setPrecipUnit] = useState('Millimeters (mm)');

    const unitsMenuRef = useRef(null);
    const searchDropdownRef = useRef(null);
    const dayDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (unitsMenuRef.current && !unitsMenuRef.current.contains(event.target)) {
                setShowUnitsMenu(false);
            }

            if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
                setShowSearchDropdown(false);
            }

            if (dayDropdownRef.current && !dayDropdownRef.current.contains(event.target)) {
                setShowDayDropdown(false);
            }
        };

        document.addEventListener("click", handleClickOutside);

        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);
    const cities = ['Berlin, Germany', 'London, UK', 'Paris, France', 'New York, USA', 'Tokyo, Japan'];

    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const days = [
        { name: 'Tue', icon: <CloudRain className="w-12 h-12" />, high: '20°', low: '14°' },
        { name: 'Wed', icon: <CloudRain className="w-12 h-12" />, high: '21°', low: '15°' },
        { name: 'Thu', icon: <Sun className="w-12 h-12" />, high: '24°', low: '14°' },
        { name: 'Fri', icon: <CloudSun className="w-12 h-12" />, high: '25°', low: '13°' },
        { name: 'Sat', icon: <CloudRain className="w-12 h-12" />, high: '21°', low: '15°' },
        { name: 'Sun', icon: <Cloud className="w-12 h-12" />, high: '25°', low: '16°' },
        { name: 'Mon', icon: <Wind className="w-12 h-12" />, high: '24°', low: '15°' }
    ];

    const hourlyData = [
        { time: '3 PM', temp: '20°', icon: <Cloud className="w-6 h-6" /> },
        { time: '4 PM', temp: '20°', icon: <CloudSun className="w-6 h-6" /> },
        { time: '5 PM', temp: '20°', icon: <Sun className="w-6 h-6" /> },
        { time: '6 PM', temp: '19°', icon: <Cloud className="w-6 h-6" /> },
        { time: '7 PM', temp: '18°', icon: <Cloud className="w-6 h-6" /> },
        { time: '8 PM', temp: '18°', icon: <Wind className="w-6 h-6" /> },
        { time: '9 PM', temp: '17°', icon: <Cloud className="w-6 h-6" /> },
        { time: '10 PM', temp: '17°', icon: <Cloud className="w-6 h-6" /> }
    ];

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-950 text-white p-6 overflow-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                    <Sun className="w-8 h-8 text-orange-400" />
                    <h1 className="text-2xl font-bold">Weather Now</h1>
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
                            <div className="px-4 py-3 bg-gray-500">
                                <p className="text-sm font-medium text-white">Switch to Imperial</p>
                            </div>

                            <div className="py-2">
                                <p className="px-4 py-1 text-xs text-gray-300">Temperature</p>
                                <button
                                    onClick={() => setTempUnit('Celsius (°C)')}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 bg-gray-600 flex justify-between items-center text-white"
                                >
                                    <span>Celsius (°C)</span>
                                    {tempUnit === 'Celsius (°C)' && <span>✓</span>}
                                </button>
                                <button
                                    onClick={() => setTempUnit('Fahrenheit (°F)')}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 bg-gray-600 text-white"
                                >
                                    Fahrenheit (°F)
                                </button>
                            </div>

                            <div className="py-2">
                                <p className="px-4 py-1 text-xs text-gray-300">Wind Speed</p>
                                <button
                                    onClick={() => setWindUnit('km/h')}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 bg-gray-600 flex justify-between items-center text-white"
                                >
                                    <span>km/h</span>
                                    {windUnit === 'km/h' && <span>✓</span>}
                                </button>
                                <button
                                    onClick={() => setWindUnit('mph')}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-700 bg-gray-600 text-white"
                                >
                                    mph
                                </button>
                            </div>

                            <div className="py-2">
                                <p className="px-4 py-1 text-xs text-gray-300">Precipitation</p>
                                <button
                                    onClick={() => setPrecipUnit('Millimeters (mm)')}
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
            <h2 className="text-5xl font-bold text-center mb-12">How's the sky looking today?</h2>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-12 flex gap-4">
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

                    {showSearchDropdown && (
                        <div className="absolute top-full mt-2 w-full rounded-xl shadow-xl overflow-hidden z-50">
                            {cities.map((city, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setSearchQuery(city);
                                        setShowSearchDropdown(false);
                                    }}
                                    className="w-full text-left px-6 py-3 hover:bg-gray-700 bg-gray-800 transition text-white"
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button className="bg-indigo-600 px-8 py-4 rounded-xl hover:bg-indigo-500 transition font-semibold">
                    Search
                </button>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto grid  grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Weather Card */}
                <div className="lg:col-span-2 bg-blue-500/40 from-indigo-600 to-indigo-800 rounded-3xl p-8 relative overflow-hidden">
                    {/* Decorative elements */}
                    {/* <div className="absolute top-10 right-20 w-3 h-3 bg-orange-400 rounded-full"></div> */}
                    {/* <div className="absolute top-40 right-10 w-2 h-2 bg-orange-400 rounded-full"></div> */}
                    {/* <div className="absolute bottom-32 right-32 w-2 h-2 bg-indigo-400 rounded-full"></div> */}

                    <div className="relative z-10">
                        <h3 className="text-3xl font-bold mb-2">Berlin, Germany</h3>
                        <p className="text-indigo-200 mb-8">Tuesday, Aug 5, 2025</p>

                        <div className="flex items-center justify-between">
                            <Sun className="w-32 h-32 text-yellow-300" />
                            <div className="text-8xl font-bold">20°</div>
                        </div>
                    </div>
                    {/* Weather Details */}
                    <div className="lg:col-span-2 grid grid-cols-4 pt-[200px] gap-4">
                        <div className="bg-indigo-900/50 rounded-2xl hover:bg-indigo-800/50 p-6">
                            <p className="text-indigo-300 mb-2">Feels Like</p>
                            <p className="text-4xl font-bold">18°</p>
                        </div>
                        <div className="bg-indigo-900/50 rounded-2xl hover:bg-indigo-800/50 p-6">
                            <p className="text-indigo-300 mb-2">Humidity</p>
                            <p className="text-4xl font-bold">46%</p>
                        </div>
                        <div className="bg-indigo-900/50 rounded-2xl hover:bg-indigo-800/50 p-6">
                            <p className="text-indigo-300 mb-2">Wind</p>
                            <p className="text-4xl font-bold">14 km/h</p>
                        </div>
                        <div className="bg-indigo-900/50 rounded-2xl hover:bg-indigo-800/50 p-6">
                            <p className="text-indigo-300 mb-2">Precipitation</p>
                            <p className="text-4xl font-bold">0 mm</p>
                        </div>
                    </div>
                </div>

                {/* Hourly Forecast */}
                <div className="bg-indigo-900/50 rounded-3xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Hourly forecast</h3>
                        <div className="relative" ref={dayDropdownRef}>
                            <button
                                onClick={() => setShowDayDropdown(!showDayDropdown)}
                                className="flex items-center gap-2 text-sm bg-indigo-800 px-3 py-1 rounded-lg hover:bg-indigo-700"
                            >
                                <span>{selectedDay}</span>
                                <span>▼</span>
                            </button>

                            {showDayDropdown && (
                                <div className="absolute right-0 mt-2 w-40 rounded-xl shadow-xl overflow-hidden z-50">
                                    {weekDays.map((day) => (
                                        <button
                                            key={day}
                                            onClick={() => {
                                                setSelectedDay(day);
                                                setShowDayDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-700 bg-gray-600 transition text-white"
                                        >
                                            {day}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        {hourlyData.map((hour, index) => (
                            <div key={index} className="flex items-center justify-between bg-indigo-800/50 hover:bg-indigo-600/50 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    {hour.icon}
                                    <span className="font-semibold">{hour.time}</span>
                                </div>
                                <span className="font-semibold">{hour.temp}</span>
                            </div>
                        ))}
                    </div>
                </div>



                {/* Daily Forecast */}
                <div className="lg:col-span-3">
                    <h3 className="text-2xl font-bold mb-6">Daily forecast</h3>
                    <div className="grid grid-cols-7 gap-4">
                        {days.map((day, index) => (
                            <div key={index} className="bg-indigo-900/50 rounded-2xl p-4 text-center hover:bg-indigo-800/50 transition cursor-pointer">
                                <p className="font-semibold mb-4">{day.name}</p>
                                <div className="flex justify-center mb-4 text-indigo-300">
                                    {day.icon}
                                </div>
                                <p className="text-lg font-bold">{day.high}</p>
                                <p className="text-sm text-indigo-300">{day.low}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
