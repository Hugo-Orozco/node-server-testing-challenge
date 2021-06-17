const ingredients = [
    {
        step_id: 2,
        ingredient_id: 27,
        ingredient_name: 'olive oil',
        quantity: 0.014
    }
];

exports.ingredients = ingredients;

exports.seed = function (knex) {
    return knex('ingredients').insert(ingredients);
};
