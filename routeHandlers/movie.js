"use strict";

const axios = require("axios");

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

class MovieData {
  constructor(objectData) {
    this.name = objectData.title;
    this.release = objectData.release_date;
    this.overview = `The movie ${objectData.title} was released on ${objectData.release_date}. ${objectData.overview}`;
    this.poster = objectData.poster_path;
  }
}

module.exports = { MovieData: MovieData, handleGetMovies: handleGetMovies };
