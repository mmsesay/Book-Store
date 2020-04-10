// modules
const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

// app instance
const app = express();

// all cross-origin requests
app.use(cors());

// connect to the mongo database
const db = require('./config/db').MongoURI;

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database Connection Successful'))
    .catch(err => console.log(err));


// middlewares
app.use('/graphql', graphqlHTTP({
    // graphql schema
    schema,
    graphiql: true
}));

// listen for port
app.listen(4000, () => {
    console.log('listenig on port 4000');
});
