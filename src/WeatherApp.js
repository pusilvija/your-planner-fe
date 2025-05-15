import React, { useState, useEffect } from "react";
import axios from "axios";
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
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Unable to fetch weather data. Please try again.");
      setWeather(null); // Clear previous weather data
    } finally {
      setLoading(false); // Hide loading state
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude); // Fetch weather using user's location
        },
        (err) => {
          setError("Unable to retrieve your location. Please allow location access.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserLocation(); // Get user's location on component mount
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