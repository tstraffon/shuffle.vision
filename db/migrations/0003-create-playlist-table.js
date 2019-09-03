exports.up = function (knex)
{
    return knex.schema.createTable('playlist', function (t)
    {
        t.uuid('id').primary('PK_Bucket');
        t.string('name');
        t.uuid('memberId');
        t.boolean('public');
        t.date('dateAdded');
        t.date('lastUpdated');
        t.foreign('memberId', 'FK_MemberId').references('id').on('member').onUpdate('CASCADE').onDelete('CASCADE');
    });
};

exports.down = function (knex)
{
    return knex.schema.dropTableIfExists('playlist');
};
