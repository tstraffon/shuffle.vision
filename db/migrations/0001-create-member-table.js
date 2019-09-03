exports.up = function (knex)
{
    return knex.schema.createTable('member', function (t)
    {
        t.uuid('id').primary('PK_Member');
        t.string('userName').unique('IX_Member_UserName');
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
