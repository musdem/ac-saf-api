const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const constants = require('./constants');
const { mongoose, userSchema } = require('./db');
const { getPublicKey, getPrivateKey, verifyToken, verifyLogin } = require('./security');

function login(req, res) {
	if(req.body.username && req.body.password) {
		const { username, password } = req.body;
		const User = mongoose.model('User', userSchema);
		User.findOne({username}, "password salt name username priceBought turnipsBought fossilsOwned", (err, user) => {
			if (err) {
				console.log('db read error', err);
				res.status(500).json({status: constants.LOGIN_ISSUE});
			} else if (!user) {
				res.status(401).json({status: constants.LOGIN_FAILURE});
			} else {
				crypto.scrypt(password, user.salt, 64, (err, key) => {
					if (err) {
						console.log('scrypt error', err);
						res.status(500).json({status: 'login issue'});
					} else if (key.toString('hex') === user.password.toString('hex')) {
						jwt.sign({username, name: user.name}, getPrivateKey(), {algorithm: 'RS256'}, (err, token) => {
							if (err) {
								console.log('jwt sign error', err);
								res.status(500).json({status: constants.LOGIN_ISSUE});
							} else {
								res.json({
									status: 'success',
									token,
									name: user.name,
									username: user.username,
									priceBought: user.priceBought,
									turnipsBought: user.turnipsBought,
									fossilsOwned: user.fossilsOwned
								});
							}
						});
					} else {
						res.status(404).json({status: constants.LOGIN_FAILURE});
					}
				});
			}
		});
	} else {
		res.status(500).json({status: constants.NO_USER_PASS});
	}
}

function create(req, res) {
	if (req.body.username && req.body.password && req.body.name) {
		const { username, password, name } = req.body;
		const User = mongoose.model('User', userSchema);
		const salt = crypto.randomBytes(128).toString('base64');
		User.findOne({username}, 'username', (err, user) => {
			if (err) {
				res.status(500).json({error: 'error when checking if userexists, please try again later'});
			} else if (user) {
				res.status(400).json({error: 'user already exists, use a different username.'});
			} else {
				crypto.scrypt(password, salt, 64, (err, key) => {
					if (err) {
						console.log('scrypt error', err);
						res.status(500).json({status: 'create error'});
					} else {
						User.create({username, password: key, salt, name}, (err, user) => {
							if (err) {
								res.status(500).json({'error': err});
							} else {
								res.json({
									status: 'successfully created account',
									user: user.name
								});
							}
						});
					}
				});
			}
		});
	} else {
		res.status(500).json({'error': 'must include username, password, name, and dodoCode'});
	}
}

function getUser(req, res) {
	if (req.body.token) {
		verifyToken(req.body.token, (status) => {
			switch(status) {
				case constants.WRONG_KEY:
					res.status(401).json({status: 'invalid key'});
					break;
				case constants.VERIFY_ERROR:
					res.status(500).json({status: 'verify failure'});
					break;
				default:
					const User = new mongoose.model('User', userSchema);
					User.findOne({username: status.username}, 'name username priceBought turnipsBought fossilsOwned', (err, user) => {
						if (err) {
							res.status(500).json({error: 'failed to fetch user info'});
						} else {
							res.send({
								name: user.name,
								username: user.username,
								priceBought: user.priceBought,
								turnipsBought: user.turnipsBought,
								fossilsOwned: user.fossilsOwned
							});
						}
					});
			}
		});
	} else {
		console.log('verify error:', err);
		res.status(401).json({status: 'authentication required'});
	}
}

function verify(req, res) {
	if (req.body.token) {
		verifyToken(req.body.token, (status) => {
			switch(status) {
				case constants.WRONG_KEY:
					res.status(401).json({status: 'invalid key'});
					break;
				case constants.VERIFY_ERROR:
					res.status(500).json({status: 'verify failure'});
					break;
				default:
					res.send(status);
			}
		});
	} else {
		console.log('verify error:', err);
		res.status(401).json({status: 'authentication required'});
	}
}

function getPubKey(req, res) {
	res.json({key: getPublicKey().toString()});
}

module.exports = {
	login,
	create,
	verify,
	getPubKey,
	getUser
};
