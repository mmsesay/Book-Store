// require the modules
const graphql = require("graphql");
const _= require("lodash");

// require the models
const BookModel = require("../models/Book")
const AuthorModel = require("../models/Author")


// get the graphql properties
const {
    GraphQLObjectType, 
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull
} = graphql;

// dummy data
// var books = [
//     {name:'Name of the wind',genre:'Fantasy',id:'1', authorId:'1'},
//     {name:'The Final empire',genre:'Fantasy',id:'2', authorId:'2'},
//     {name:'The long earth',genre:'Sci-Fi',id:'3', authorId:'3'},
//     {name:'The Hero of ages',genre:'Fantasy',id:'4', authorId:'2'},
//     {name:'The Colour of the Magic',genre:'Fantasy',id:'5', authorId:'3'},
//     {name:'The Light Fantastic',genre:'Sci-Fi',id:'6', authorId:'3'}
// ];

// var authors = [
//     {name:'Patrick Rothfuss', age:44, id:'1'},
//     {name:'Brandon Sanderson', age:42, id:'2'},
//     {name:'Terry Pratchett', age:66, id:'3'}
// ]

// Book object function
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                // return _.find(authors, { id: parent.authorId })
                return AuthorModel.findById(parent.authorId)
            }
        }
    })
});

// Author Object Function
const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent,args){
                // return _.filter(books, { authorId: parent.id })
                return BookModel.find({authorId: parent.id})
            }
        }
    })
})

// rootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        // get specific books query
        book: {
            type: BookType,
            args: {id:{type:GraphQLID}},
            resolve(parent, args){
                // code to get data from db / other sources
                // return _.find(books, { id:args.id })
                return BookModel.findById(args.id)
            }
        },
        // get all books query
        books: {
            type: new GraphQLList(BookType),
            resolve(parent,args){
                return BookModel.find({})
            }
        },
        // get specific authors query
        author: {
            type: AuthorType,
            args: {id:{type:GraphQLID}},
            resolve(parent, args){
                // code to get data from db / other sources
                // return _.find(authors, { id:args.id })
                return AuthorModel.findById(args.id)
            }
        },
        // get all authors query
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return AuthorModel.find({})
            }
        }
        
    }
})

// mutation
const Mutation = new GraphQLObjectType({
    name: 'mutation',
    fields: {
        // adding a new author
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent,args){
                // create the new author object
                let author = new AuthorModel({
                    name: args.name,
                    age: args.age
                })
                // return the result after saving the data
                return author.save()
            }
        },
        // adding a new book
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent,args){
                // create the new book object
                let book = new BookModel({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                })
                // return the result after saving the data
                return book.save()
            }
        }
    }
})


// export schema
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
