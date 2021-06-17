const express = require('express');

const { checkRecipeId, checkRecipeName } = require('./recipe-middleware');

const Recipes = require('./recipe-model');

const router = express.Router();

router.get('/:recipe_id', checkRecipeId, (req, res, next) => {
    const { recipe_id } = req.params;

    Recipes.getRecipeById(recipe_id)
        .then(recipe => {
            res.json(recipe);
        })
        .catch(next);
});

router.post('/', checkRecipeName, (req, res, next) => {
    const recipe = req.body;

    Recipes.postRecipe(recipe)
        .then(recipe => {
            res.status(201).json(recipe);
        })
        .catch(next);
});

router.delete('/:recipe_id', checkRecipeId, (req, res, next) => {
    const { recipe_id } = req.params;

    Recipes.deleteRecipeById(recipe_id)
        .then(recipe => {
            res.status(200).json(recipe);
        })
        .catch(next);
});

router.use((err, req, res, next) => { // eslint-disable-line
    res.status(err.status || 500).json({
        custom: 'Internal Server Error',
        message: err.message,
        stack: err.stack
    });
});

module.exports = router;
