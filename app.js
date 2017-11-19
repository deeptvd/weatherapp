const express = require('express');
const bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session'); 
const axios = require('axios');

const app = express();

const port = process.env.PORT;

//Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Express Session middleware
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//Flash Middleware
app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next(); 
});

//Index Route
app.get('/', (req, res) => {
  const title = "Welcome";
  res.render('index', {
    title:title
  });
});

//About Route
app.get('/about', (req, res) => {
  res.render('about');
});

//Weather Page
app.get('/api/weather', (req, res) => {
  res.render('weather');
});

//Weather Route
app.post('/api/weather', (req, res) => {
  const zip = req.body.zipcode;
  const units = "imperial";
  const appSecret = "0f6f539a51844dc80364edb30889276b";
  const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${appSecret}&units=${units}`;

  axios.get(weatherUrl)
    .then((response) => {
    const result = {
      description: response.data.weather[0].description,
      temp: response.data.main.temp,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      cityName: response.data.name,
    };
    res.render('weather', {
      result: result
    });
  }).catch((e) => {
    if(e.code === 'ENOTFOUND'){
      console.log('Unable to connect to API servers');
    }else {
      req.flash('error_msg', 'Please enter valid zipcode');
      res.redirect('/api/weather')
    }
  });
});

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});