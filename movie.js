const axios = require('axios');
const config = require('./config.js');

 function discoverMovie(kind, genreId, language){
    if (genreId == null){
        console.log(`Unknown genre [${genre}]`);
        return [{
            type: 'quickReplies',
            content: `Sorry, but I don\'t recognize this genre : ${genreId}`,
        }];
    }
return axios.get(`https://api.themoviedb.org/3/discover/${kind}`, {
    params: {
    api_key: config.MOVIE_TOKEN,
    sort_by: 'popularity.desc',
    include_adult: false,
    with_genres: genreId,
    with_original_language: language,
    },
}).then(results => {
    if (results.data.total_results === 0) {
        console.log('No match');
        return [{
            type: 'text',
            content : `I'm sorry, i couldn't get any suggestions`,
        }];
    }
    const cards = results.data.results.slice(0, 10).map(movie => ({
        title: movie.title,
        subtitle: movie.overview,
        imageUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
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
module.exports = discoverMovie;