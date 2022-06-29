'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const movies = require('./data/movies.json');
// const { response } = require('express');
// const { request } = require('http');

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get('/', (request, response) => { // the slash denotes http://localhost:3000/  <-- see that last slash? that's the one!

  response.send('Happiness is a full tank of gas nowhere to be and all day to get there!');
});

// Create an API endpoint of `/ movies` that processes a `GET`` request that contains`lat`, `lon` and `searchQuery` information.
app.get('/movies', async (request, response) => {
  let lat = request.query.lat;
  let lon = request.query.lon;
  console.log('proof of life that the code is getting this far!');
  // let searchQuery = request.query.searchQuery;

  // for lab 8 we'll no longer be using this to find the searched for city;  Use the .find() method to discover which city the `lat`, `lon` and `searchQuery` information belong to.

  // const city = movies.find(cityObj => cityObj.city_name.toLowerCase() === searchQuery.toLowerCase());

  // this find method searches over the movies data and sends back any city therein whose name is exactly equal to what was searched for as a lower case string

  try {
    //Using each ata point from the static data of the city that the user searched, create an array of 'Forecast' objects, one for each day.
    const url = `https://api.moviesbit.io/v2.0/forecast/daily?key=${process.env.movies_API_KEY}&days=3&lat=${lat}&long=${lon}`;

    console.log('URL: ', url);
    const moviesData = await axios.get(url);
    console.log(moviesData.data);

    const moviesArray = moviesData.data.data.map(day => new Forecast(day));

    // Send the full array back to the client who requestd data from the `/movies` endpoint.
    response.status(200).send(moviesArray); //.send sends whatever is in parens back up to the client in this case it is sending the resulting mapped moviesArray back

  } catch (error) {
    // If the user did not search for one of the three cities that we have information about (Seattle, Paris, or Amman), return an error.
    console.error(error);
    response.status(500).send('city not found'); //code 500 indicates a local server error
  }
});

// class for `Forecast`, that has properties of `date` and `description`
class Forecast {
  constructor(day) {
    this.day = day.valid_date;
    this.description = day.movies.description;
  }
}

// Adding movie endpoint
app.get('/movies', async (request, response) => {
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

// we COULD put the get on line 31 inside of this class as a method but it is not required (it was done that way in class 7 demo)

// Remember, both classes and constructor functions both make objects, this function is equivalent to the class above
// function Forecast(day) {
//   this.day = day.valid_date;
//   this.description = day.movies.description;

// Create a function to handle errors from any API call. Wildcard handling.
app.use('*', (request, response) => response.status(404).send('that endpoint does not exist'));

// tells the express app which port to listen on
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
