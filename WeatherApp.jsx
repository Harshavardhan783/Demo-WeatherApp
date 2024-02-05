import { useState } from "react";
import "./WeatherApp.css";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';

function WeatherApp() {
  const [time, setTime] = useState(new Date());
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  setInterval(() => {
    setTime(new Date());
  }, 1000);

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const getWeatherData = () => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error('City not found');
      }
    })
      .then((data) => {
        console.log(data);
        setWeatherData(data);
        getForecastData(data.coord.lat, data.coord.lon);
        setErrorMessage('');
      })
      .catch((error) => {
        setErrorMessage(error.message);

      });   
      
  };

  const getForecastData = (lat, lon) => {
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly&units=metric&appid=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setForecastData(data.daily.slice(1, 6));
      });
  };

  const toggleUnits = () => {
    setIsCelsius(!isCelsius);
  };

  const convertTemperature = (temp) => {
    if (isCelsius) {
      return temp;
    } else {
      return (temp * 9) / 5 + 32;
    }
  };

  return (
    <div className="WeatherApp">
      <div className="WeatherApp">
    </div>
      <div id="time">{time.toLocaleTimeString()}</div>
      <div id="date">{days[time.getDay()]}, {time.getDate()} {months[time.getMonth()]}</div>
      <input type="text" value={city} onChange={handleCityChange} placeholder="Enter city name" />
      <button onClick={getWeatherData}>Search</button>
      <button onClick={toggleUnits}>{isCelsius ? "Switch to Fahrenheit" : "Switch to Celsius"}</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {weatherData && (
        <div>
          <div id="current-weather-items">
            <div className="weather-item">
              <div>Minimum Temperature</div>
              <div>{convertTemperature(weatherData.main.temp_min)}&deg;{isCelsius ? "C" : "F"}</div>
            </div>
            <div className="weather-item">
              <div>Maximum Temperature</div>
              <div>{convertTemperature(weatherData.main.temp_max)}&deg;{isCelsius ? "C" : "F"}</div>
            </div>
            <div className="weather-item">
              <div>Humidity</div>
              <div>{weatherData.main.humidity}%</div>
            </div>
            <div className="weather-item">
              <div>Wind Speed</div>
              <div>{weatherData.wind.speed} m/s</div>
            </div>
            <div className="weather-item">
              <div>Wind Direction</div>
              <div>{weatherData.wind.deg}&deg;</div>
            </div>
          </div>
          <div id="current-temp">
            <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`} alt="weather icon" className="w-icon" />
            <div className="other">
              <div className="day">{weatherData.weather[0].main}</div>
              <div className="temp">{convertTemperature(weatherData.main.temp)}&deg;{isCelsius ? "C" : "F"}</div>
              <div className="description">{weatherData.weather[0].description}</div>
            </div>
          </div>
        </div>
      )}
      {forecastData && (
        <div>
          <div className="forecast-container">
            {forecastData.map((day) => (
              <div className="forecast-item" key={day.dt}>
                <div className="date">{new Date(day.dt * 1000).toLocaleDateString()}</div>
                <div className="forecast-details">
                  <div className="temp">{convertTemperature(day.temp.day)}&deg;{isCelsius ? "C" : "F"}</div>
                  <div className="description">{day.weather[0].description}</div>
                </div>
                <img src={`http://openweathermap.org/img/wn/${day.weather[0].icon}.png`} alt="weather icon" className="w-icon" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;