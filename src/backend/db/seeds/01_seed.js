/* eslint-disable no-await-in-loop */
const User = require('../../models/user');

exports.seed = async (knex) => {
    await knex('users').del();

    await User.create({ name: 'tom' })
};