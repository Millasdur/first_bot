// server.js
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');
const getWeather = require('./bot.js');
const discoverMovie = require('./movie.js')

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

  // Find the movie id of a genre entity
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
    console.log("Weather request received -> POS/bot");
    const memory = req.body.conversation.memory;
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
    console.log('Movie request received -> POST /movie');
    const memory = req.body.conversation.memory;
    const movie = memory.movie;
    const tv = memory.tv;
    const kind = movie ? 'movie' : 'tv';
    const language = memory.language;
    const genreId = getGenreId(memory.genre.value);
    const nationality = memory.nationality;
    const isoCode = language

      ? language.short.toLowerCase()
      : nationality.short.toLowerCase();

    return discoverMovie(kind, genreId, isoCode)
        .then((carouselle) => res.json({
        replies: carouselle,
      }))
  });


app.listen(process.env.PORT || 5000, () => console.log(`App started on port ${config.PORT}`));
