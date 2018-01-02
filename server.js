var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var handlebars = require("express-handlebars");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require('cheerio');

var db = require("./models");

const app = express();

app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"))


app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/???", {
  useMongoClient: true
});


var PORT = process.env.PORT || 3000;

//route to display root
app.get('/', function(req, res){
  res.render('index');
});


app.listen(PORT, function(){
  console.log("App running on port " + PORT + " !");
});
