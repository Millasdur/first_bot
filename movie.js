const axios = require('axios');
const config = require('./config.js');

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

  function discoverMovie(kind, genreId, language) {
    return axios.get(`https://api.themoviedb.org/3/discover/${kind}`, {
      params: {
        api_key: config.MOVIEDB_TOKEN,
        sort_by: 'popularity.desc',
        include_adult: false,
        with_genres: genreId,
        with_original_language: language,
      },
    }).then(results => {
      if (results.length === 0) {
        return [{
          type: 'quickReplies',
          content: {
            title: 'Sorry, but I could not find any results for your request :(',
            buttons: [{ title: 'Start over', value: 'Start over' }],
          },
        }];
      }
  
      const cards = results.slice(0, 10).map(movie => ({
        title: movie.title || movie.name,
        subtitle: movie.overview,
        imageUrl: `https://image.tmdb.org/t/p/w640${movie.poster_path}`,
        buttons: [
          {
            type: 'web_url',
            value: `https://www.themoviedb.org/movie/${movie.id}`,
            title: 'View More',
          },
        ],
      }));
  
      return [
        {
          type: 'text',
          content: "Here's what I found for you!",
        },
        { type: 'carousel', content: cards },
      ];
    });
  }
  
  module.exports.discoverMovie = discoverMovie;

  module.exports.getGenreId = getGenreId;