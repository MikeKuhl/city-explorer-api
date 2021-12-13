"use strict";

const axios = require("axios");
const cache = require("./cache.js");

async function handleGetMovies(req, res) {
  const key = req.url;
  const today = new Date();
  const hours = today.getHours();
  const date = today.getDate();

  if (cache.movie[key]) {
    if (cache.movie[key].time < hours) {
      delete cache.movie[key];
    } else {
      cache.movie = {};
    }
  }

  if (cache.movie[key]) {
    console.log("cache hit");
    res.status(200).send(cache.movie[key].data);
    return;
  }

  try {
    console.log("cache miss");
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIEDB_API_KEY}&query=${req.query.query}`;

    const resultData = await axios.get(url);
    console.log(resultData);
    const parsedMovieData = resultData.data.results.map(
      (movies) => new MovieData(movies)
    );
    cache.movie[key] = {
      data: parsedMovieData,
      time: hours,
    };
    cache.date = date;
    res.send(parsedMovieData);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("server error");
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

module.exports = handleGetMovies;
