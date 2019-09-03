const phraseplaylists = require('../data/json/phraseplaylists.js');

exports.seed = function(knex, Promise) 
{
    return knex('phraseplaylist').del().then(function () 
    {
      return knex('phraseplaylist').insert(phraseplaylists);
    });
};