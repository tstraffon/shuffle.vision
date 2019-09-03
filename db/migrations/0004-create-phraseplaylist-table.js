exports.up = function (knex)
{
    return knex.schema.createTable('phraseplaylist', function (t)
    {
        t.uuid('phraseId');
        t.uuid('playlistId');
        t.uuid('memberId');
        t.date('dateAdded');
        t.date('lastUpdated');
        t.foreign('phraseId', 'FK_PhraseId').references('id').on('phrase').onUpdate('CASCADE').onDelete('CASCADE');
        t.foreign('playlistId', 'FK_PlaylistId').references('id').on('playlist').onUpdate('CASCADE').onDelete('CASCADE');
        t.foreign('memberId', 'FK_MemberId').references('id').on('member').onUpdate('CASCADE').onDelete('CASCADE');
    });
};

exports.down = function (knex)
{
    return knex.schema.dropTableIfExists('phraseplaylist');
};
