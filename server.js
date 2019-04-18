// All the NPM Package Stuff
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");

// Require The Models
const Models = require("./models");

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




app.get("/scrape", function(req, res) {
    axios.get("https://deadspin.com/").then(function(data){

        const $ = cheerio.load(data.data);

        $("article.postlist__item").each(function(element){

        const result = {};

        result.title = $(this).find(".js_entry-title").text()
        result.link = $(this).find(".js_entry-link").attr("href")
        result.summary = $(this).find("p").text()

        console.log(result)
        
    });
    
});
});