const environment = process.env.NODE_ENV || 'development';
const config = require('../../../knexfile')[environment];
console.log('config: ', config);
module.exports = require('knex')(config);
