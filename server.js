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


app.set('view engine', 'handlebars');
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.use(express.static("public"));
// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/rascraper");


var PORT = process.env.PORT || 3000;

//route to display root
app.get('/', function(req, res){
  res.render('index');
});

//scrape route
app.get("/scrape", function(req,res){

  axios.get("https://www.residentadvisor.net/news.aspx").then(function(res) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(res.data);
    //console.log(res.data);

    $("article").each = (i, element) => {

      var result = {};

      result.title = $(this)
      .children("a:nth-child(4)")
        .children("h1")
        .text();
      result.link = $(this)
        .children("a:nth-child(4)")
        .attr("href");
      result.text = $(this)
        .children("p:nth-child(5)")
        .text();
      result.image = $(this)
      .children("a:nth-child(2)")
        .children("img")
        .attr('src');




        db.Article
          .create(result)
          .then(function(dbArticle){

            res.render('index', {articles: dbArticle});
          })
          .catch(function(err){
            res.json(err);
          });
    };

  });

})


app.listen(PORT, function(){
  console.log("App running on port " + PORT + " !");
});
