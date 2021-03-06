const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {
        type: String,
    },
    link: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    isSaved: {
        type: Boolean,
        default: false,
    },
    note: {
        type: [{ type: Schema.Types.ObjectId,
        ref: "Note"}],
    }
});

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;