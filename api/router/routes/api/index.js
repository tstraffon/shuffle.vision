const express = require('express');
const { knex } = require('../../../../connectors/postgresConnector');
const router = express.Router();
const moment = require('moment');

// GET THAT DATA BABY

// Returns phrases for the provided member/playlist combination 
router.get('/playlistPhrases', async (req, res, next) => {
    try {
        console.log("[api] playlistPhrases req", req.query);
        const { playlists, memberIds } = req.query;
        const result = await knex('phrase')
            .leftJoin('playlist', 'phrase.playlistId','playlist.id')
            .select('phrase')
            .whereIn('playlist.id', playlists)
            .whereIn('playlist.memberId', memberIds)
            .orderBy('phrase')
            .groupBy('phrase')

        res.send(result);
    } catch (err) {
        next(err);
    }
});

// Returns phrases for the provided member/playlist combination 
router.get('/memberPlaylistAndPhrases', async (req, res, next) => {
    try {
        console.log("[api] playlistPhrases req", req.query);
        const { memberId } = req.query;
        const result = await knex('phrase')
            .leftJoin('playlist', 'phrase.playlistId','playlist.id')
            .select()
            .where('playlist.memberId', memberId)
            .orderBy('phrase.dateAdded', 'phrase.phrase')
        // console.log("[api] phrases result", result);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

// Returns phrases for the provided member/playlist combination 
router.get('/memberPlaylistPhrases', async (req, res, next) => {
    try {
        console.log("[api] memberPlaylistPhrases req", req.query);
        let { memberId, playlistId } = req.query;

        if(!playlistId || playlistId == 0){
            console.log("[api] test", playlistId);

            const playlist = await knex('playlist')
                .select('id')
                .orderBy('name', 'DESC')
                .limit('1')
                .where('playlist.memberId', memberId)
            
            playlistId = playlist[0].id
        }

        const result = await knex('phrase')
            .leftJoin('playlist', 'phrase.playlistId','playlist.id')
            .select('phrase.id', 'phrase', 'phrase.memberId', 'playlistId', 'phrase.dateAdded', 'phrase.lastUpdated', 'name', 'public')
            .where('playlist.memberId', memberId)
            .andWhere('playlist.id', playlistId)
            .orderBy('phrase.dateAdded', 'phrase.phrase')

        res.send(result);
    } catch (err) {
        next(err);
    }
});

// Returns all playlists associated with the provided member
router.get('/memberPlaylists', async (req, res, next) => {
    try {
        console.log("[api] memberPlaylists req", req.query);
        const { memberId } = req.query;
        const result = await knex('playlist')
            .select()
            .orderBy('name', 'DESC')
            .where('playlist.memberId', memberId)
        res.send(result);
    } catch (err) {
        next(err); 
    }
});

// Returns all playlists associated with the provided phrase
router.get('/phrasePlaylists', async (req, res, next) => {
    try {
        console.log("[api] phrasePlaylists req", req.query);
        const { phrase } = req.query;
        const result = await knex('phrase')
            .leftJoin('playlist', 'phrase.playlistId','playlist.id')
            .select('playlist.id')
            .where('phrase', phrase)
        res.send(result);
    } catch (err) {
        next(err);
    }
});

// Returns all playlists 
router.get('/allPlaylists', async (req, res, next) => {
    try {
        console.log("[api] allplaylists req", req.query);
        const result = await knex('playlist')
            .select();
            // console.log("[api] allplaylists result", {result});
        res.send(result);
    } catch (err) {
        next(err);
    }
});

// Submit new phrases to a member/playlist combination 
router.get('/addPhrases', async (req, res, next) => {
    try {

        console.log("[api] addPhrases req", req.query);

        const { phrase, memberId, playlistIds } = req.query;
        let phraseInserts = [];
        await knex.raw('create extension if not exists "uuid-ossp"');


        for(const p of playlistIds){

            const {rows} = await knex.raw('SELECT uuid_generate_v1()');
            const phraseId = rows[0].uuid_generate_v1
            const now = moment();

            const phrasePayload = {
                id: phraseId,
                phrase,
                memberId,
                playlistId: p,
                dateAdded: now,
                lastUpdated: now,
            }

            phraseInserts.push(phrasePayload)
        }

        const phraseResult = await knex('phrase')
            .insert(phraseInserts);

        knex.raw('drop extension if exists "uuid-ossp"');

        // console.log("[api] addPhrase result", result);
        res.send(phraseResult);
    } catch (err) {
        next(err);
    }
});


// Update phrase value
router.get('/updatePhrase', async (req, res, next) => {
    try {

        console.log("[api] updatePhrase req", req.query);

        const { phraseId, newValue } = req.query;

        await knex('phrase')
            .where('id', phraseId)
            .update({phrase: newValue})

        res.send(200);

    } catch (err) {
        next(err);
    }
});

// Update phrase playlists
router.get('/updatePhrasePlaylists', async (req, res, next) => {
    try {

        console.log("[api] updatePhrasePlaylists req", req.query);

        const { phrase, addToPlaylists, removeFromPlaylists, memberId } = req.query;
        await knex.raw('create extension if not exists "uuid-ossp"');
        const now = moment();

        if(addToPlaylists){
            for(const p of addToPlaylists){

                const duplicateCheck = await knex('phrase')
                    .where('phrase', phrase)
                    .andWhere('playlistId', p)
    
                if(duplicateCheck.length > 0){
                    continue;
                }
    
                const {rows} = await knex.raw('SELECT uuid_generate_v1()');
                const newPhraseId = rows[0].uuid_generate_v1
    
                const result =  await knex.raw(`
                    INSERT INTO phrase (
                        "id",
                        "phrase",
                        "memberId",
                        "playlistId",
                        "dateAdded",
                        "lastUpdated"
                    )
                    VALUES (
                        :phraseId,
                        :phrase,
                        :memberId,
                        :playlistId,
                        :dateAdded,
                        :lastUpdated
                    ) ON CONFLICT DO NOTHING
                `,{
                    phraseId: newPhraseId,
                    phrase,
                    playlistId: p,
                    memberId,
                    dateAdded: now,
                    lastUpdated: now
                })
            }
        }
       
        if(removeFromPlaylists){
            for(const p of removeFromPlaylists){
                const result = await knex('phrase')
                    .delete()
                    .where('phrase', phrase)
                    .andWhere('playlistId', p)
            }
        }

        knex.raw('drop extension if exists "uuid-ossp"');
        res.send(200);

    } catch (err) {
        next(err);
    }
});

// Delete phrase from playlist
router.get('/deletePhraseFromPlaylist', async (req, res, next) => {
    try {

        console.log("[api] deletePhraseFromPlaylist req", req.query);

        const { phraseId, playlistId } = req.query;

        const result = await knex('phrase')
            .delete()
            .where('id', phraseId)
            .andWhere('playlistId', playlistId)

        res.send(200);

    } catch (err) {
        next(err);
    }
});



// Producers
router.get('/producers/one', async (req, res, next) => {
    try {
        const { query: { producerId } } = req;
        const result = await knex('MemberProducer')
            .select()
            .leftJoin('BeatMemberProducer', 'MemberProducer.UUID', 'BeatMemberProducer.MemberProducerUUID')
            .leftJoin('Beat', 'BeatMemberProducer.BeatUUID', 'Beat.UUID')  
            .where('UUID', producerId);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

router.get('/producers/all', async (req, res, next) => {
    try {
        const result = await knex('MemberProducer')
            .select()
            .leftJoin('BeatMemberProducer', 'MemberProducer.UUID', 'BeatMemberProducer.MemberProducerUUID')
            .leftJoin('Beat', 'BeatMemberProducer.BeatUUID', 'Beat.UUID');           
        res.send(result);
    } catch (err) {
        next(err);
    }
});


// Cart
router.get('/cart', async (req, res, next) => {
    const { query } = req;
    const { userId } = query;
    console.log("cart request userId", userId);
    try {
        const result = await knex('Cart', 'beats')
            .select('beatId', 'name', 'length', 'exclusivePrice', 'leasePrice')
            .join('beats', 'Cart.beatId', '=', 'beats.id')
            .where('userId', userId);
        res.send(result);
    } catch (err) {
        next(err);
    }
});


// Users
router.get('/lastUserId', async (req, res, next) => {
    try {
        const result = await knex('users')
            .select('id')
            .order('DESC');
        res.send(result);
    } catch (err) {
        next(err);
    }
});


module.exports = router;
