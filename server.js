"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const weatherDataJson = require("./data/weather.json");
const { request } = require("express");
const axios = require("axios");

const app = express();

app.use(cors());

const PORT = process.env.PORT;

app.get("/test", (req, res) => {
  res.send("Tested");
});
app.get("/weather", handleGetWeather);
app.get("/movies", handleGetMovies);
app.get("/*", (req, res) => {
  res.status(404).send("error not found");
});
async function handleGetMovies(req, res) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${req.query.query}`;

  console.log("hello");

  await axios
    .get(url)
    .then((results) => {
      let movie = results.data.results.map(
        (resultData) => new MovieData(resultData)
      );
      console.log(movie);
      res.status(200).send(movie);
    })
    .catch((error) => {
      console.error(error.message);
      res.status(500).send("server error");
    });
}
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

class MovieData {
  constructor(objectData) {
    this.name = objectData.title;
    this.release = objectData.release_date;
    this.overview = `The movie ${objectData.title} was released on ${objectData.release_date}. ${objectData.overview}`;
    this.poster = objectData.poster_path;
  }
}

app.listen(PORT, () => console.log("server is listening on port ", PORT));
