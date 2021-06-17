const express = require('express');
const cors = require('cors');

const RecipeRouter = require('./recipes/recipe-router');

const server = express();

server.use(express.json());
server.use('/api/recipes', RecipeRouter);
server.use(cors());

module.exports = server;
