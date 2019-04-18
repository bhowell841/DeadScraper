const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const axios = require("axios");
const cheerio = require("cheerio");

// const db = require("./models");

const PORT = 3003;

const app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

axios.get("https://deadspin.com/").then(function(data){

    const $ = cheerio.load(data.data);

    $("article.postlist__item").each(function(element){

        const result = {};

        result.title = $(this).find(".js_entry-title").text()
        result.link = $(this).find(".js_entry-link").attr("href")
        result.summary = $(this).find("p").text()

        console.log(result)
        // db.Article.create(result)
        // .then(dbArticle => {
        //     console.log(dbArticle);
        // })
        // .catch(err =>{
        //     console.log(err);
        // });
    });
})

app.listen(3003, function(){
    console.log("Listening on PORT " + 3003)
})