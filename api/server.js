const express = require('express');
const path = require('path');
const { connection, knex } = require('../connectors/postgresConnector');
const { apiRouter } = require('./router');
const axios = require('axios');

const env = process.env.NODE_ENV || 'development';
const port = process.env.PORT || 5000;


const app = express();

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// test query
app.get('/beats', function (req, res) {
    connection.connect();

    connection.query('SELECT * FROM beats LIMIT 0, 10', function (error, results, fields) {
      if (error) throw error;
      res.send(results)
    });

    connection.end();
});

// const test = axios.create({ baseURL: 'localhost:5000', });

// Mapping to router depending on environment
if (env === 'development') {
    // use React proxy routing
    app.use('/api', apiRouter);
} else {
    // use Web Server routing (Kubernetes Ingress)
    app.use(express.static(`${__dirname}/client/build`));
    app.all('*', (req, res, next) => res.sendFile(`${__dirname}/client/build/index.html`));
}

app.listen(port);


console.log('API listening on port ' + port);