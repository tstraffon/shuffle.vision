const { Router } = require('express');

const proxyRouter = instance => {
    const router = Router();

    router.use(async (req, res, next) => {
        const method = req.method.toLowerCase();
        const url = req.originalUrl.replace(/\/[\w-]+(.*)/, '$1');
        let config = {};
        if (method === 'post') {
            config = req.body;
        }
        try {
            const { data } = await instance[method](url, config);
            res.send(data);
        } catch (err) {
            console.error(err);
            next(err);
        }
    });

    return router;
};

module.exports = proxyRouter;