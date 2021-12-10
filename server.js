"use strict";

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { request } = require("express");
const axios = require("axios");
const weather = require("./routeHandlers/weather");
const app = express();
const movie = require("./routeHandlers/movie");
app.use(cors());

const PORT = process.env.PORT;

app.get("/test", (req, res) => {
  res.send("Tested");
});
app.get("/weather", weather.handleGetWeather);
app.get("/movies", movie.handleGetMovies);
app.get("/*", (req, res) => {
  res.status(404).send("error not found");
});

app.listen(PORT, () => console.log("server is listening on port ", PORT));
