"use strict";

const axios = require("axios");

function handleGetWeather(req, res, next) {
  const url = `http://api.weatherbit.io/v2.0/forecast/daily?lat=${req.query.lat}&lon=${req.query.lon}&key=${process.env.WEATHERBIT_API_KEY}&units=I`;

  axios
    .get(url)
    .then((results) => {
      let weatherDescriptions = results.data.data.map(
        (day) => new Forecast(day)
      );
      res.status(200).send(weatherDescriptions);
    })
    .catch((error) => {
      console.error(error.message);
      res.status(500).send("server error");
    });
}

class Forecast {
  constructor(objectData) {
    this.name = objectData.city_name;
    this.lat = objectData.lat;
    this.lon = objectData.lon;
    this.date = objectData.datetime;
    this.description = `${objectData.max_temp}, ${objectData.low_temp}, ${objectData.weather.description}`;
  }
}

module.exports = { Forecast: Forecast, handleGetWeather: handleGetWeather };
