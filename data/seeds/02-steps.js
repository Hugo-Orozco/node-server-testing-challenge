const steps = [
    {
        recipe_id: 1,
        step_number: 1,
        step_instructions: 'Put a large saucepan on a medium heat',
    },
    {
        recipe_id: 1,
        step_number: 2,
        step_instructions: 'Mix eggs and ham',
    }
];

exports.steps = steps;

exports.seed = function (knex) {
    return knex('steps').insert(steps);
};
