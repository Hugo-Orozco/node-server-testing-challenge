const db = require('../../data/db-config');

function getRecipeById(recipe_id) {
    return db('steps')
        .select([
            're.recipe_name',
            're.created_at',
            'st.*'
        ])
        .from('recipes as re')
        .leftJoin('steps as st', 're.recipe_id', 'st.recipe_id')
        .where('re.recipe_id', recipe_id)
        .orderBy('st.step_number', 'asc')
        .then(async steps => {
            for (let i = 0; i < steps.length; i++) {
                await db('ingredients')
                    .select([
                        // 'ig.*',
                        'ig.ingredient_id',
                        'ig.ingredient_name',
                        'ig.quantity'
                    ])
                    .from('ingredients as ig')
                    .where('ig.step_id', steps[i].step_id)
                    .then(ingredients => {
                        // ingredients.forEach(ingredient => delete ingredient.step_id);
                        Object.assign(steps[i], { ingredients });
                    });
            }

            let newSteps;

            newSteps = steps.filter(step => step.step_id !== null);

            newSteps = steps.map(step => {
                return {
                    step_id: step.step_id,
                    step_number: step.step_number,
                    step_instructions: step.step_instructions,
                    ingredients: step.ingredients
                };
            });

            return {
                recipe_id: steps[0] && steps[0].recipe_id !== null ? steps[0].recipe_id : Number(recipe_id),
                recipe_name: steps[0] && steps[0].recipe_name !== null ? steps[0].recipe_name : null,
                created_at: steps[0] && steps[0].created_at ? steps[0].created_at : null,
                steps: newSteps
            };
        });
}

function postRecipe(recipe) {
    return db('recipes')
        .insert(recipe)
        .then(ids => {
            return getRecipeById(ids[0]);
        });
}

function deleteRecipeById(recipe_id) {
    const deleted = getRecipeById(recipe_id);
    return db('recipes')
        .where({ recipe_id })
        .del()
        .then(() => {
            return deleted;
        });
}

module.exports = {
    getRecipeById,
    postRecipe,
    deleteRecipeById
};
