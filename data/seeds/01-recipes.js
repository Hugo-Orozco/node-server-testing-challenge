const recipes = [
    { recipe_name: 'Spaghetti Bolognese' }
];

exports.recipes = recipes;

exports.seed = function (knex) {
    return knex('recipes').insert(recipes);
};
