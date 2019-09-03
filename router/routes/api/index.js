const config = require('config');
const axios = require('axios');

const proxyRouter = require('../proxyRouter');

const instance = axios.create({
    baseURL: config.get('api'),
});

module.exports = proxyRouter(instance);