// require models
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema definition
const bookSchema = new Schema({
    name: String,
    genre: String,
    authorId: String
})

// export the schema
module.exports = mongoose.model('Book', bookSchema);