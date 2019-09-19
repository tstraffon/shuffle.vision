exports.up = function (knex)
{
    return knex.schema.createTable('member', function (t)
    {
        t.string('userName').unique('IX_Member_UserName').primary('PK_Member');
        t.string('password');
        t.string('email').unique('IX_Member_Email');
        t.date('dateAdded');
        t.date('lastUpdated');
    });
};

exports.down = function (knex)
{
    return knex.schema.dropTableIfExists('member');
};
