const crypto = require('crypto');

const constants = require('./constants');
const { mongoose, fossilSchema, userSchema } = require('./db');
const { verifyToken } = require('./security');

function getFossils(req, res) {
	const Fossils = new mongoose.model('Fossils', fossilSchema);
	Fossils.find({}, 'name selling itemId price', (err, fossils) => {
		if (err) {
			res.status(500).json({error: 'Failed to fetch fossils for sale.'});
		} else {
			res.json(fossils.map(fossil => {
				return {
					name: fossil.name,
					selling: fossil.selling,
					itemId: fossil.itemId,
					price: fossil.price
				}
			}));
		}
	});
}

function postFossils(req, res) {
	if (req.body.token && req.body.key) {
		verifyToken(req.body.token, req.body.key, (verifyStatus) => {
			switch(verifyStatus) {
				case constants.WRONG_KEY:
					res.status(401).json({status: 'invalid key'});
					break;
				case constants.VERIFY_ERROR:
					res.status(500).json({status: 'verify failure'});
					break;
				default:
					switch (req.params[0]) {
						case 'sell':
						case 'buy':
							postAd(req, res);
							break;
						case 'delete':
							deleteAd(req, res);
							break;
						case 'own':
							updateOwned(req, res);
							break;
						default:
							res.json({error: 'You must include what you would like to do with the fossils'});
					}
			}
		});
	}
}

function postAd(req, res) {
	const Fossils = new mongoose.model('Fossils', fossilSchema);
	if (req.body.name && req.body.itemId && req.body.price) {
		const posting = {
			name: req.body.name,
			selling: req.query[0] === 'sell',
			itemId: req.body.itemId,
			price: req.body.price
		};
		Fossils.create(posting, (err, fossil) => {
			if (err) {
				res.status(500).json({error: 'Error when posting fossil ad, try again later.'});
			} else {
				res.json({
					status: 'Successfully posted fossil ad.',
					fossil
				});
			}
		});
	} else {
		res.json({error: 'you must include both your name, itemID, and price.'});
	}
}

function deleteAd(req, res) {
	const Fossils = new mongoose.model('Fossils', fossilSchema);
	if (req.body.name && req.body.itemId) {
		const posting = {
			name: req.body.name,
			itemId: req.body.itemId
		};
		Fossils.deleteOne(posting, (err) => {
			if (err) {
				res.status(500).json({error: 'Error when deleting fossil ad, please try again later.'});
			} else {
				res.json({
					status: 'Successfully deleted fossil ad.'
				});
			}
		});
	} else {
		res.json({error: 'You must include your name and itemId.'});
	}
}

function updateOwned(req, res) {
	if (req.body.itemId) {
		const User = new mongoose.model('User', userSchema);
		User.update({name: req.body.name}, {'$push': {fossilsOwned: req.body.itemId}}, (err, user) => {
			if (err) {
				res.status(500).json({error: 'Failed to update fossils owned, please try again later.'});
			} else {
				res.json({
					status: 'Successfully updated fossils owned',
					name: req.body.name
				});
			}
		});
	} else {
		res.json({error: 'You must include your name and itemId.'});
	}
}

module.exports = {
	getFossils,
	postFossils
}