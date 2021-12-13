"use strict";

const axios = require("axios");

const cache = require("./cache.js");

async function handleGetWeather(req, res) {
  const { lat, lon } = req.query;
  const key = "weather-" + lat + lon;
  const today = new Date();
  const hours = today.getHours();
  const date = today.getDate();

  if (cache.weather[key]) {
    if (cache.weather[key].time < hours) {
      delete cache.weather[key];
    } else {
      cache.weather = {};
    }
  }

  if (cache.weather[key]) {
    console.log("cache hit");
    res.status(200).send(cache.weather[key].data);
    return;
  }

  try {
    console.log("cache miss");
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHERBIT_API_KEY}&units=I`;
    const weatherData = await axios.get(url);
    const parsedWeatherData = weatherData.data.data.map(
      (day) => new Forecast(day)
    );
    cache.weather[key] = {
      data: parsedWeatherData,
      time: hours,
    };
    cache.date = date;
    res.send(parsedWeatherData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
  }
}

class Forecast {
  constructor(objectData) {
    this.name = objectData.city_name;
    this.lat = objectData.lat;
    this.lon = objectData.lon;
    this.date = objectData.datetime;
    this.description = `${objectData.max_temp}, ${objectData.low_temp}, ${objectData.weather.description}`;
    this.codes = objectData.weather.icon;
  }
}

module.exports = handleGetWeather;
