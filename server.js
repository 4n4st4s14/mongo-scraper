var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var handlebars = require("express-handlebars");
var cheerio = require('cheerio');

var db = require("./models");

const app = express();
app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));


var PORT = process.env.PORT || 3000;

//route to display root
app.get('/', function(req, res){
  res.render('index');
});


app.listen(PORT, function(){
  console.log("App running on port " + PORT + " !");
});
