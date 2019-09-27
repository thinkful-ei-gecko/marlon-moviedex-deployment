'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const app = express();

const movies = require('./movieStore');

app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(' ')[1] !== apiToken){
    return res.status(401).json({error: 'Unauthorized request'});
  }

  next();
});

//users can search for movies by genre, country, or avg_vote

app.get('/movie', (req, res) => {
  const {genre, country, avg_vote} = req.query;

  let newMovies;

  if (genre){
    newMovies = movies.filter(movie => movie.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if (country){
    newMovies = movies.filter(movie => movie.country.toLowerCase().includes(country.toLowerCase()));
  }

  if (avg_vote){
    newMovies = movies.filter(movie =>  movie.avg_vote >= parseInt(avg_vote));
  }
    
  res.json(newMovies);
});

const PORT = process.env.PORT || 8000;

app.listen(8080, () => {
  console.log(`Server is listening on ${PORT}`);
});