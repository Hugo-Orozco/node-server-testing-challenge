const recipes = require('./recipe-model');

const checkRecipeId = (req, res, next) => {
    const { recipe_id } = req.params;

    recipes.getRecipeById(recipe_id)
        .then(data => {
            if (!data.recipe_name || !data.created_at) {
                next({ status: 404, message: `Recipe with recipe_id ${recipe_id} not found.` });
            }
            else {
                next();
            }
        })
        .catch(err => {
            next(err);
        });
};

const checkRecipeName = (req, res, next) => {
    const { recipe_name } = req.body;
    if (!recipe_name) {
        next({ status: 400, message: 'invalid recipe_name' });
    }
    else {
        next();
    }
};

module.exports = {
    checkRecipeId,
    checkRecipeName
};
