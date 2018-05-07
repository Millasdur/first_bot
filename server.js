// index.js
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');
const getWeather = require('./bot.js');
const movie = require('./movie.js')

const app = express();
app.use(bodyParser.json());

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
})

app.post('/movie', (req, res) => {
    console.log('[POST] /movie');
    const memory = req.body.conversation.memory;
    const movie = memory.movie;
    const tv = memory.tv;

    // Check for the presence of entities movie or tv
    // If both are present, we prioritize movie
    const kind = movie ? 'movie' : 'tv';

    const genre = memory.genre;
    const genreId = constants.movie.getGenreId(genre.value);

    const language = memory.language;
    const nationality = memory.nationality;

    // Similar to movie and tv, we prioritize language over nationality
    const isoCode = language
      ? language.short.toLowerCase()
      : nationality.short.toLowerCase();

    return movie.discoverMovie(kind, genreId, isoCode)
      .then((carouselle) => res.json({
        replies: carouselle,
      }))
      .catch((err) => console.error('movieApi::discoverMovie error: ', err));
  });

app.listen(process.env.PORT || 5000, () => console.log(`App started on port ${config.PORT}`));
