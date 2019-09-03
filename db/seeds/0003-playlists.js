const playlists = require('../data/json/playlists.js');

exports.seed = function(knex, Promise) 
{
    return knex('playlist').del().then(function () 
    {
      return knex('playlist').insert(playlists);
    });
};