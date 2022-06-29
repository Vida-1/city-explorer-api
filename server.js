'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
// const movies = require('./data/movies.json');  //don't have this file yet

// const { response } = require('express');
// const { request } = require('http');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;
app.get('/', (request, response) => { // the slash denotes http://localhost:3000/  <-- see that last slash? that's the one!
  response.send('Proof of Life: Happiness is a full tank of gas nowhere to be and all day to get there!');
});


app.get('/weather', async (request, response) => {
  let lat = request.query.lat;
  let lon = request.query.lon;
  let searchQuery = request.query.searchQuery;
  // const city = weather.find(cityObj.city_name.toLowerCase() === searchQuery.toLowerCase()); // lab 7 only
  try {
    const weatherArray = city.data.map(day => new Forecast(day));
    response.status(200).send(weatherArray);
    // const url = `https://api.moviesbit.io/v2.0/forecast/daily?key=${process.env.MOVIE_API_KEY}&days=3&lat=${lat}&long=${lon}`;
    // console.log('URL: ', url);
    // const moviesData = await axios.get(url);
    // console.log(moviesData.data);
  } catch (error) {
    console.error(error);
    response.status(500).send('city not found');
  }
});

class Forecast {   // class for `Forecast`, that has properties of `date` and `description`
  constructor(day) {
    this.day = day.valid_date;
    this.description = day.movies.description;
  }
}

app.get('/movies', async (request, response) => {  // Adding movie endpoint
  let searchQuery = request.query.searchQuery;
  try {
    const url = `https://api.themoviedb.org/3/movie/550?api_key=${process.env.MOVIE_API_KEY}&query=$[searchQuery}&language-en-US&page=1`;
    console.log('URL: ', url);
    const moviesData = await axios.get(url);
    console.log(moviesData.data);
    const moviesArray = moviesData.data.results.map(movie => new Movies(movie));
    response.status(200).send(moviesArray);
  } catch (error) {
    console.error(error);
    response.status(500).send('movies were not found for the searched for city');
  }
});

class Movies {
  constructor(movie) {
    this.title = movie.title;
    this.overview = movie.overview;
    this.average_votes = movies.vote_average;
    this.total_votes = movie.vote_count;
    this.image_url = 'https://image.tmdb.org/t/p/w/500' + movie.poster_path;
    this.popularity = movie.popularity;
    this.released_on = movie.release_date;
  }
}

app.use('*', (request, response) => response.status(404).send('that endpoint does not exist'));  // Wildcard error (from any API call) handling

app.listen(PORT, () => console.log(`listening on port ${PORT}`)); // tells the express which port to listen on
