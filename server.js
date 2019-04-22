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


// app.get("/saved", function(req, res) {
//     db.Article.find({ isSaved: true }).then(function (retrievedArticles) {
//         res.render("savedArticles", { articles: retrievedArticles });
//     })
// });

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

// app.get("/articles/:id", function(req, res) {
//     db.Article.findOne({_id: req.params.id}).populate("note").then(function(data){
//         console.log(data);
//         res.json(data);
//     }).catch(function(err){
//         console.log(err);
//     })
// });

// app.post("/articles/:id", function(req, res) {
//     db.Note.create(req.body).then(function(data) {
//         console.log(req.params.id);
//         return Models.Article.findOneAndUpdate({_id: req.params.id}, {$set: {note: data._id}}, { new: true });  
//     }).then(function(data) {
//         res.json(data);
//     }).catch(function(err){
//         res.status(500).end();
//     })
// });

// app.put("/saved/:id", function(req, res) {
//     db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {saved: true}})
//     .then(function(data) {
//         res.json(data);
//     })
// });

// app.put("/removed/:id", function(req, res) {
//     db.Article.findOneAndUpdate({_id: req.params.id}, {$set: {saved: false}})
//     .then(function(data) {
//         res.json(data);
//     })
// });

// app.delete("/articles", function(req, res) {
//     db.Article.remove({})
//     .then(function(data) {
//         res.json(data);
//     })
// });
app.get("/saved", (req, res) => {
    db.Article.find({isSaved: true})
        .then(function (retrievedArticles) {
            // If we were able to successfully find Articles, send them back to the client
            let hbsObject;
            hbsObject = {
                articles: retrievedArticles
            };
            res.render("savedArticles", hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.put("/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(function (data) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(data);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });;
});

app.put("/remove/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(function (data) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(data)
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.find({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate({
            path: 'note',
            model: 'Note'
        })
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
app.post("/note/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { note: dbNote._id }}, { new: true });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

app.delete("/note/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.findByIdAndRemove({ _id: req.params.id })
        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({ note: req.params.id }, { $pullAll: [{ note: req.params.id }]});
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

