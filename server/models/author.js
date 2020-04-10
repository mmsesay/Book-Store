// require models
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// schema definition
const authorSchema = new Schema({
    name: String,
    age: Number
})

// export the schema
module.exports = mongoose.model('Author', authorSchema);