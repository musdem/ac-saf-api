const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const constants = require('./constants');
const { mongoose, userSchema } = require('./db');
const { getPublicKey, getPrivateKey, verifyToken, verifyLogin } = require('./security');

function login(req, res) {
	if(req.body.username && req.body.password) {
		const { username, password } = req.body;
		const User = mongoose.model('User', userSchema);
		User.findOne({username}, "password salt name priceBought turnipsBought", (err, user) => {
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
						jwt.sign({username, password: key}, getPrivateKey(), {algorithm: 'RS256'}, (err, token) => {
							if (err) {
								console.log('jwt sign error', err);
								res.status(500).json({status: constants.LOGIN_ISSUE});
							} else {
								res.json({
									status: 'success',
									token,
									name: user.name,
									priceBought: user.priceBought,
									turnipsBought: user.turnipsBought
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
	} else {
		res.status(500).json({'error': 'must include username, password, name, and dodoCode'});
	}
}

function verify(req, res) {
	if (req.body.token && req.body.key) {
		const { token, key } = req.body;
		verifyToken(token, key, (status) => {
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
	res.send(getPublicKey());
}

module.exports = {
	login,
	create,
	verify,
	getPubKey
};
