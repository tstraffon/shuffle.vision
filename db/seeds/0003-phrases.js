const phrases = require('../data/json/phrases.js');

exports.seed = function(knex, Promise) 
{
    return knex('phrase').del().then(function () 
    {
      return knex('phrase').insert(phrases);
    });
};