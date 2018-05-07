// index.js
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config.js');
const getWeather = require('./bot.js');

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

app.listen(config.PORT, () => console.log(`App started on port ${config.PORT}`));
