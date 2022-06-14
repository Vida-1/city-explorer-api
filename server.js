'use strict';

// require libraries
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// import dummy weather data
const weather = require('./data/weather.json');
const { response } = require('express');
const { request } = require('http');

const app = express();  // creates an instance of the express library and saving it as the variable app
app.use(cors());  // this tells the app to use cors as the middleware

// set port connections
const PORT = process.env.PORT || 3002;

// Nerdly server home route proof of life
app.get('/', (request, resonse) => { // the slash denotes http://localhost:3000/  <-- see that last slash? that's the one
  response.send(`Coders Log, Star Date ${Date.now()} point ${Date.getTime()}`);
});

// Create an API endpoint of `/ weather` that processes a `GET`` request that contains`lat`, `lon` and `searchQuery` information.
app.get('/weather', (request, response) => {
  // let lat = request.query.lat; // labs 8/9
  // let lon = request.query.lon; // labs 8/9
  let searchQuery = request.query.searchQuery; // the city we searched for

  // Use the .find() method to discover which city the `lat`, `lon` and `searchQuery` information belong to.
  const city = weather.find(cityObj => cityObj.city_name.toLowerCase() === searchQuery.toLowerCase());

  try {
    //Using each ata point from the static data of the city that the user searched, create an array of 'Forecast' objects, one for each day.
    const weatherArray = city.data.map(day => new Forecast(day));

    // Send the full array back to the client who requestd data from the `weather` endpoint.
    response.status(200).send(weatherArray); //.send sends whatever is in parens back up to the client!

  } catch (error) {
    // If the user did not search for one of the three cities that we have information about (Seattle, Paris, or Amman), return an error.
    console.error(error);
    resonse.status(500).send('city not found');
  }
});

// Create a class for `Forecast`, that has properties of `date` and `description`.
// Remember, both classes and constructor functions both make objects.
function Forecast(day) {
  this.day = day.valid_date;
  this.description = day.weather.description;
}

// Create a function to handle errors from any API call. Wildcard handling.
app.use('*', (reqeust, response) => response.status(404).send('that endpoint does not exist'));

// tells the express app which port to listen on
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
