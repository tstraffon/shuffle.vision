const express = require('express');
const bodyParser = require('body-parser');
const { apiRouter } = require('./router');
var helmet = require('helmet');
const app = express();

app.use(helmet({ ieNoOpen: false }));
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '5000kb' }));

const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
    // use React proxy routing
    app.use('/api', apiRouter);

} else {
    // use Web Server routing (Kubernetes Ingress)
    app.use(express.static(`${__dirname}/client/build`));
    app.all('*', (req, res, next) => res.sendFile(`${__dirname}/client/build/index.html`));
}

app.get('/', (req, res, next) => res.sendStatus(200));
app.get('/healthz', (req, res, next) => res.sendStatus(200));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
    if (env === 'development') console.log(`React UI listening on port: 3000`);
});
