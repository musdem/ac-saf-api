const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { mongoose } = require('./db');
const blogClient = require('./blog');
const concertClient = require('./concert.js');
const songClient = require('./songs')
const loginClient = require('./login');
const { PORT, API_GUIDE } = require('./constants');

const server = express();
const apiRouter = express.Router();

server.use(bodyParser.json());
server.use(cors());

apiRouter.all('/', (req, res) => {
	res.json(API_GUIDE);
});

apiRouter.get('/blogs', blogClient.getBlog);

apiRouter.post('/blogs', blogClient.postBlog);

apiRouter.get('/concerts', concertClient.getConcerts);

apiRouter.post('/concerts', concertClient.postConcert);

apiRouter.post('/bookings', (req, res) => {
	// TODO send email to stephen I guess?
	// probably use nodemailer
	res.json(req.body);
});

apiRouter.get('/songs', songClient.getSongs);

apiRouter.post('/song', songClient.postSong);

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
