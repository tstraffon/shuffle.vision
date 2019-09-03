const members = require('../data/json/members.js');

exports.seed = function(knex, Promise) 
{
    return knex('member').del().then(function () 
    {
      return knex('member').insert(members);
    });
};