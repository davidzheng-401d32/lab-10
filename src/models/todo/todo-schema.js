'use strict';

const express = require('express');
const {buildSchema} = require('graphql');
const expressGraphql = require('express-graphql');
const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const router = express.Router();

const todo = mongoose.Schema({
  text: { type:String, required:true },
  category: {type: String},
  assignee: { type:String, required:true },
  difficulty: {type:Number, required:true, default: 3},
  complete: {type:Boolean, required:true, default:false},
});

const Todo = mongoose.model('todo', todo);

const schema = buildSchema(`
  type Category {
    id: ID!
    name: String
    description: String
  }

  type Query {
    categories: [Category]
  }

  type Mutation {
    createCategory(name: String, description: String): Category
  }
`);

const resolvers = {
  todo: async function() {
    const data = await Todo.find({});
    return data;
  },
};

router.use('/graphql', expressGraphql({
  schema: schema,
  rootValue: resolvers,
  graphiql: true,
}));

module.exports = mongoose.model('todo', todo);
