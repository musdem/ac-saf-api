const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const { mongoose, userSchema } = require('./db');
const constants = require('./constants');

let privateKey = '';
let publicKey = '';
const User = mongoose.model('User', userSchema);

function SecurityClient() {
	fs.readFile('./saf', (err, data) => {
		if (err) {
			console.log('unable to open private key, exiting', err);
			process.exit(1);
		} else {
			privateKey = data;
		}
	});

	fs.readFile('./saf.pub', (err, data) => {
		if (err) {
			console.log('unable to open public key, exiting', err);
			process.exit(1);
		} else {
			publicKey = data;
		}
	});
}

function verifyToken(token, key, tokenStatus) {
	jwt.verify(token, key, (err, decoded) => {
		if (err) {
			if (err.message.includes('PEM_read_bio_PUBKEY')) {
				console.log('wrong pubkey');
				tokenStatus(constants.WRONG_KEY);
			} else {
				console.log('error', err);
				tokenStatus(constants.VERIFY_ERROR);
			}
		} else {
			tokenStatus(decoded);
		}
	});
}

function getPrivateKey() {
	return privateKey;
}

function getPublicKey() {
	return publicKey;
}

const securityClient = new SecurityClient();

module.exports = {
	getPrivateKey,
	getPublicKey,
	verifyToken
};
