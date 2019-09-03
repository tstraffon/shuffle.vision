const express = require('express');
const { knex } = require('../../../../connectors/postgresConnector');
const router = express.Router();
const moment = require('moment');

// GET THAT DATA BABY

// Returns phrases for the provided member/playlist combination 
router.get('/sessionplaylistphrases', async (req, res, next) => {
    try {
        console.log("[api] phrases req", req.query);
        const { playlists, memberId } = req.query;
        const result = await knex('phraseplaylist')
            .leftJoin('phrase','phraseplaylist.phraseId', 'phrase.id')
            .leftJoin('playlist', 'phraseplaylist.playlistId','playlist.id')
            .select()
            .whereIn('playlist.name', playlists)
            .andWhere('playlist.memberId', memberId)
        // console.log("[api] phrases result", result);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

// Returns all phrases accessible by member for the provided member/playlist combination 
router.get('/allplaylists', async (req, res, next) => {
    try {
        console.log("[api] phrases req", req.query);
        const { memberId } = req.query;
        const result = await knex('playlist')
            .select()
            .where('playlist.memberId', memberId)
        // console.log("[api] phrases result", result);
        res.send(result);
    } catch (err) {
        next(err);
    }
});

// Submit new phrases to a member/playlist combination 
router.get('/addPhrase', async (req, res, next) => {
    try {

        console.log("[api] addPhrase req", req.query);


        const { phrase, memberId, playlists } = req.query;
        await knex.raw('create extension if not exists "uuid-ossp"');
        const {rows} = await knex.raw('SELECT uuid_generate_v1()');
        const id = rows[0].uuid_generate_v1
        console.log('[api] rows response', rows);
        console.log('[api] id response', id);
        knex.raw('drop extension if exists "uuid-ossp"');
        const now = moment();
        const payload = {
            id,
            phrase,
            memberId,
            dateAdded: now,
            lastUpdated: now,
        }
        const result = await knex('phrase')
            .insert(payload);
        // console.log("[api] addPhrase result", result);
        res.send(result);
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



// POST THAT DATA BABY HOT DAMN
router.post('/addToCart/', async (req, res, next) => {
    const { query } = req;
    const { beatId, userId } = query;

    console.log("[api] adding beat", beatId, "to user", userId ,"cart...");
    try {
        knex('Cart').insert({ userId: userId, beatId: beatId })
        .then( function (result) {
            res.json({ success: true, message: 'ok' });
            console.log("[api] add beat", beatId, "to user", userId ,"cart successful");
        });
        return;
    } catch (err) {
        next(err);
    }
});



module.exports = router;
