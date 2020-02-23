exports.up = function (knex)
{
    return knex.schema.createTable('phrase', function (t)
    {
        t.uuid('id').primary('PK_Phrase');
        t.string('phrase');
        t.string('memberId');
        t.uuid('playlistId');
        t.date('dateAdded');
        t.date('lastUpdated');
        t.foreign('memberId', 'FK_MemberId').references('userName').on('member').onUpdate('CASCADE').onDelete('CASCADE');
        t.foreign('playlistId', 'FK_Playlist').references('id').on('playlist').onUpdate('CASCADE').onDelete('CASCADE');
    });
};

exports.down = function (knex)
{
    return knex.schema.dropTableIfExists('phrase');
};