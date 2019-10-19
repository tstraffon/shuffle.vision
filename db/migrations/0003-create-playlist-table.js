exports.up = function (knex)
{
    return knex.schema.createTable('playlist', function (t)
    {
        t.uuid('id').primary('PK_Playlist');
        t.string('name');
        t.string('memberId');
        t.boolean('public');
        t.date('dateAdded');
        t.date('lastUpdated');
        t.foreign('memberId', 'FK_MemberId').references('userName').on('member').onUpdate('CASCADE').onDelete('CASCADE');
    });
};

exports.down = function (knex)
{
    return knex.schema.dropTableIfExists('playlist');
};
