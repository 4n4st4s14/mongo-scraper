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
mongoose.connect(var MONGODB_URI=process.env.MONGODB_URI || "mongodb://localhost/nytscraper");


var PORT = process.env.PORT || 3000;

//route to display root
app.get('/', function(req, res){
  db.Article
    .find({})
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.render('index', {articles: dbArticle});
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

//scrape route
app.get("/scrape", function(req,res){

  axios.get("https://www.nytimes.com/section/technology").then(function(res) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(res.data);
  //  console.log(res.data);
  $("div.story-body").each(function(i, element) {
    var result = {};

var link = $(element).find("a").attr("href");
var title = $(element).find("h2.headline").text().trim();
var summary = $(element).find("p.summary").text().trim();
var img = $(element).parent().find("figure.media").find("img").attr("src");
result.link = link;
result.title = title;
if (summary) {
  result.summary = summary;
};
if (img) {
  result.img = img;
}
else {
  result.img = $(element).find(".wide-thumb").find("img").attr("src");
};

        db.Article
          .create(result)
          .then(function(dbArticle){

            res.status(200);
          })
          .catch(function(err){
            res.json(err);
          });
    });

  });

});

//saved route
app.get("/saved", function(req,res){
  db.Article.find({issaved: true}, null, function(err,data){
    res.render("saved", {saved: data});
  });
});

//get article by id route
app.get("/:id", function(req,res){
  db.Article.findById(req.params.id, function(err,data){
    res.json(data);
  })
})

//save an article
app.post("/save/:id", function(req, res){
  let id = req.params.id;
  console.log(id);
  db.Article.findById(id, function(err,data){
    if(data.issaved) {
      db.Article.findByIdAndUpdate(id, {$set: {issaved: false, status: "Save Article"}}, {new: true}, function(err,data){
        res.redirect("/saved");
      });
    } else {
      db.Article.findByIdAndUpdate(req.params.id, {$set: {issaved: true, status: "Saved"}}, {new: true}, function(err, data) {
				res.redirect("/saved");
    })
  };
  });
});

//create a Note
app.post("/note/:id", function(req,res){
  let note = new db.Note(req.body);
  note.save(function(err, note){
    if (err) throw err;
    db.Article.findByIdAndUpdate(req.params.id, {$set: {"note": note._id}}, {new: true}, function(err,newnote){
      if(err) throw err;
      else {
        res.send(newnote);
      };
    });
  });
});

//get note by id
app.get("/note/:id", function(req,res){
  var id = req.params.id;
  db.Article.findById(id).populate("note").exec(function(err,data){
    res.send(data.note);
  });
});



app.listen(PORT, function(){
  console.log("App running on port " + PORT + " !");
});
