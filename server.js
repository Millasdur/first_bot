// index.js
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');
const getWeather = require('./bot.js');
const movie = require('./movie.js')

const app = express();
app.use(bodyParser.json());

const movieGenres = [
    { id: 12, name: 'Adventure' },
    { id: 14, name: 'Fantasy' },
    { id: 16, name: 'Animated' },
    { id: 16, name: 'Animation' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 36, name: 'History' },
    { id: 37, name: 'Western' },
    { id: 53, name: 'Thriller' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 878, name: 'SF' },
    { id: 878, name: 'Sci Fi' },
    { id: 878, name: 'Sci-Fi' },
    { id: 878, name: 'Science Fiction' },
    { id: 9648, name: 'Mystery' },
    { id: 10402, name: 'Music' },
    { id: 10749, name: 'Romance' },
    { id: 10749, name: 'Romantic' },
    { id: 10751, name: 'Family' },
    { id: 10752, name: 'War' },
    { id: 10770, name: 'TV Movie' },
  ];

// Find the moviedb id of a genre entity
function getGenreId(genre) {
const row = movieGenres.find(function(elem) {
    return elem.name.toLowerCase() === genre.toLowerCase();
});

if (row) {
    return row.id;
}
return null;
}

app.post('/errors', (req, res) => {
   console.error(req.body);
   res.sendStatus(200); 
});

app.post('/bot', (req, res) => {
    console.log("Message recieved");
    const memory = req.body.conversation.memory;
    console.log(memory);
    const location = memory.location;
    const date = memory.datetime;
    const city = location.raw;

    return getWeather(city, date).then((text) => res.json({
        replies: text,
        conversation: {
            memory: {}
        }
    }));
    location = null;
    date = null;
});

app.post('/movie', (req, res) => {
    console.log('[POST] /movie');
    const memory = req.body.conversation.memory;
    const movie = memory.movie;
    const tv = memory.tv;

    // Check for the presence of entities movie or tv
    // If both are present, we prioritize movie
    const kind = movie ? 'movie' : 'tv';

    const genre = memory.genre;
    const genreId = getGenreId(genre.value);

    const language = memory.language;
    const nationality = memory.nationality;

    // Similar to movie and tv, we prioritize language over nationality
    const isoCode = language
      ? language.short.toLowerCase()
      : nationality.short.toLowerCase();

    return discoverMovie(kind, genreId, isoCode)
      .then((carouselle) => res.json({
        replies: carouselle,
      }))
      .catch((err) => console.error('movieApi::discoverMovie error: ', err));
  });

app.listen(process.env.PORT || 5000, () => console.log(`App started on port ${config.PORT}`));
