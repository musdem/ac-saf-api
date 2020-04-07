const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db');
const loginClient = require('./login');
const { PORT, API_GUIDE } = require('./constants');

const server = express();
const apiRouter = express.Router();

server.use(bodyParser.json());
server.use(cors());

apiRouter.all('/', (req, res) => {
	res.json(API_GUIDE);
});

apiRouter.get('/stonks', stonksClient.getStonks);

apiRouter.post('/stonks', stonksClient.postStonks);

apiRouter.post('/login', loginClient.login);

apiRouter.post('/create', loginClient.create);

apiRouter.post('/verify', loginClient.verify);

apiRouter.get('/get-pub-key', loginClient.getPubKey);

apiRouter.all('/*', (req, res) => {
	res.status(404).json({error: 'incorrect api endpoint'});
});

server.use('/', apiRouter);

process.on('SIGTERM', function() {
	mongoose.connection.close();
	process.exit(0);
});

server.listen(PORT, () => {
	console.log(`listening on port ${PORT}`);
});
