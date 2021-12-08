"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const weatherDataJson = require("./data/weather.json");
const { request } = require("express");

const app = express();

app.use(cors());

const PORT = process.env.PORT;
app.get("/test", (req, res) => {
  res.send("Tested");
});

class Forecast {
  constructor(objectData) {
    this.name = objectData.city_name;
    this.lat = objectData.lat;
    this.lon = objectData.lon;
    this.date = objectData.datetime;
    this.description = objectData.weather.description;
  }
}

// {:TODO: Make this a seperate function without breaking things:}
app.get("/weather", function handleGetWeather(req, res, next) {
  let inputCity = weatherDataJson.find(
    (city) => city.city_name === req.query.city_name
  );
  let responseData = inputCity.data.map((objectData) => new Forecast(objectData));
  res.send(responseData);
});

app.listen(PORT, () => console.log("server is listening on port ", PORT));
