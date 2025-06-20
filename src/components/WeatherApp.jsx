import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './WeatherApp.css';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async (lat, lon) => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(URL);
      setWeather(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError('Unable to fetch weather data. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCity = async (city) => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;

    try {
      const response = await axios.get(URL);
      setWeather(response.data);
      setError(null);
    } catch (err) {
      console.error(`Error fetching weather data for ${city}:`, err);
      setError(`Unable to fetch weather data for ${city}.`);
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (err) => {
          console.error('Error retrieving location:', err);
          setError('Unable to retrieve your location. Defaulting to Vilnius.');
          fetchWeatherByCity('Vilnius');
        }
      );
    } else {
      setError(
        'Geolocation is not supported by your browser. Defaulting to Vilnius.'
      );
      fetchWeatherByCity('Vilnius');
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  if (loading) {
    return <div className="weather-container">Loading...</div>;
  }

  if (error) {
    return <div className="weather-container">Error: {error}</div>;
  }

  const weatherIcon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h1 className="weather-title">{weather.name}</h1>
        <img
          src={weatherIcon}
          alt={weather.weather[0].description}
          className="weather-icon"
        />
      </div>
      <div className="weather-details">
        <p>
          <strong>Temperature:</strong> {weather.main.temp}°C
        </p>
        <p>
          <strong>Condition:</strong> {weather.weather[0].description}
        </p>
        <p>
          <strong>Humidity:</strong> {weather.main.humidity}%
        </p>
        <p>
          <strong>Wind Speed:</strong> {weather.wind.speed} m/s
        </p>
      </div>
    </div>
  );
};

export default WeatherApp;
