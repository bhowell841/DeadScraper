// All the NPM Package Stuff
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");

// Require The Models
const db = require("./models");

// Port
const PORT = process.env.PORT || 3003;

// Initialize Express
const app = express();

// Get the handlebars up
app.engine("handlebars", handlebars({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));



const database = process.env.MONGODB_URI || "mongodb://localhost/deadHeadlines"

mongoose.connect(database, function(error) {
    if (error) {
        console.log(error);
    }
    else {
        console.log("mongoose is running");
    }
})

app.listen(PORT, function(){
    console.log("Listening on PORT: " + PORT)
})

// do not touch---------------------
app.get("/", function(req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            const retrievedArticles = dbArticle;
            let hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            res.render("home", hbsObject);        
        })
        .catch(function (err) {
            res.json(err);
        });
});
// ------------------------
// do not touch
app.get("/scrape", function(req, res) {
    axios.get("https://deadspin.com/").then(function(data){

        const $ = cheerio.load(data.data);

        $("article.postlist__item").each(function(i, element){
        let count = i;
        const result = {};

        result.title = $(this).find(".js_entry-title").text()
            || 'No title available'
        result.link = $(this).find(".js_entry-link").attr("href")
        result.summary = $(this).find("p").text()

        console.log(result)
        db.Article.create(result).then(function(dbArticle) {
            count++;
        }).catch(function(err) {
            console.log(err)
        })
    });
        // res.send("Scraped MF'er")
        res.redirect('/');
    });
});
// ------------------------------------------


app.get("/articles/:id", function(req, res) {
    db.Article.findOne({_id: req.params.id}).populate("note").then(function(data){
        console.log(data);
        res.json(data);
    }).catch(function(err){
        console.log(err);
    })
});

app.post("/note/:id", function(req, res) {
    db.Note.create(req.body).then(function(dbNote) {
        return db.Article.findOneAndUpdate({_id: req.params.id}, {$push: {note: dbNote._id}}, { new: true });  
    }).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err){
        res.json(err);
    })
});

app.put("/remove/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(function (data) {
            res.json(data)
        })
        .catch(function (err) {   
            res.json(err);
        });
});


app.delete("/articles", function(req, res) {
    db.Article.remove({})
    .then(function(data) {
        res.json(data);
    })
});

// GOOd Leave Alone
app.get("/saved", (req, res) => {
    db.Article.find({isSaved: true})
        .then(function (retrievedArticles) {
            let hbsObject;
            hbsObject = {
                articles: retrievedArticles
            };
            res.render("savedArticles", hbsObject);
        })
        .catch(function (err) {
            res.json(err);
        });
});
// ====-----=====---=--=-=====---=-=

app.get("/articles", function (req, res) {
    db.Article.find({})
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

app.put("/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(function (data) {
            res.json(data);
        })
        .catch(function (err) {
            res.json(err);
        });;
});

