var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var http           = require('http').Server(app);
var dotenv         = require('dotenv');

// configuration ===========================================

//load environment variables,
//either from .env files (development),
//heroku environment in production, etc...
dotenv.load();

// public folder for images, css,...
app.use(express.static(__dirname + '/public'))

//parsing
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); //for parsing url encoded

// view engine ejs
app.set('view engine', 'ejs');

// routes
require('./routes/routes')(app);

//port for Heroku
app.set('port', (process.env.PORT));

//botkit (apres port)
require('./controllers/botkit')

//Keep Heroku alive :
var httpAlive = require("http");
setInterval(function() {
    httpAlive.get("http://hrtbot.herokuapp.com");
}, 300000); // every 5 minutes (300000)

//START ===================================================

http.listen(app.get('port'), function(){
  console.log('listening on port ' + app.get('port'));
});
