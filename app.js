const express = require('express');
const bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
const axios = require('axios');

const app = express();

const port = 3000;

//Body Parser Middleware
app.use(bodyParser.json());

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Index Route
app.get('/', (req, res) => {
  res.send("INDEX");
});

//Weather Route
app.get('/api/weather/:zip', (req, res) => {
  const zip = req.params.zip;
  const units = "imperial";
  const appSecret = "0f6f539a51844dc80364edb30889276b";
  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${appSecret}&units=${units}`;

  axios.get(weatherUrl).then((response) => {
    const result = {
      description: response.data.weather[0].description,
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      cityName: response.data.name,
    };
    res.status(200).send(result);
  }).catch((e) => {
    if(e.code === 'ENOTFOUND'){
      console.log('Unable to connect to API servers');
    }else {
      console.log(e.message);
    }
  });
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});