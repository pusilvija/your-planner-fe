import React, { useState, useEffect } from "react";
import axios from "axios";
import './WeatherApp.css';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
    const CITY = "Vilnius";
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&appid=${API_KEY}&units=metric`;

    const fetchWeather = async () => {
      try {
        const response = await axios.get(URL);
        setWeather(response.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWeather();
  }, []);

  if (error) {
    return <div className="weather-container">Error: {error}</div>;
  }

  if (!weather) {
    return <div className="weather-container">Loading...</div>;
  }

  const weatherIcon = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;

  return (
    <div className="weather-container">
      <div className="weather-header">
        <h1 className="weather-title">{weather.name}</h1>
        <img src={weatherIcon} alt={weather.weather[0].description} className="weather-icon" />
      </div>
      <div className="weather-details">
        <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
        <p><strong>Condition:</strong> {weather.weather[0].description}</p>
        <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
        <p><strong>Wind Speed:</strong> {weather.wind.speed} m/s</p>
      </div>
    </div>
  );
};

export default WeatherApp;