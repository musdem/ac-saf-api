const crypto = require('crypto');
const CronJob = require('cron').CronJob;

const constants = require('./constants');
const { mongoose, stonkSchema, userSchema } = require('./db');
const { verifyToken } = require('./security');

function getStonks(req, res) {
	const Stonks = mongoose.model('Stonks', stonkSchema);
	Stonks.find({}, 'name price', {}, (err, stonks) => {
		if (err) {
				res.status(500).json({error:'error'});
			} else {
				res.json(stonks.map(stonk => {
					return {
						name: stonk.name,
						price: stonk.price
					};
				}));
			}
	});
}

function postStonks(req, res) {
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
					if (req.query.sell) {
						if (req.body.price) {
							const Stonks = mongoose.model('Stonks', stonkSchema);
							Stonks.updateOne(
								{username: verifyStatus.username},
								{name: verifyStatus.name, username: verifyStatus.username, price: req.body.price},
								{upsert: true},
								(err, stonk) => {
									if (err) {
										res.status(500).json({error: err});
									} else {
										res.json({
											status: 'success',
											user: verifyStatus.name
										});
									}
								});
						} else {
							res.json({error: 'You must include both your name and the stonk price.'});
						}
					} else if (req.query.buy) {
						if (req.body.stonksBought && req.body.stonksPrice) {
							const User = mongoose.model('User', userSchema);
							User.findOneAndUpdate(
								{username: verifyStatus.username},
								{priceBought: req.body.stonksPrice, turnipsBought: req.body.stonksBought},
								(err, user) => {
									if (err) {
										res.status(500).json({error: err});
									} else {
										res.json({
											status: 'success',
											user: user.name
										});
									}
								});
						} else {
							req.json({error: 'You must include both the price you bought and the ammount you bought.'});
						}
					} else {
						res.json({error: 'You must include either stonks to sell or what you bought.'});
					}
			}
		});
	} else {
		res.status(401).json({status: 'Error: must include token and key'});
	}
}

function stonkJobs() {
	var job = new CronJob('0 0,12 * * *', () => {
		const Stonks = mongoose.model('Stonks', stonkSchema);
		Stonks.updateMany({},{'$set':{'price': 0}}, (err, stonks) => {
			if (err) {
				console.log('failed to reset stonk price');
			}
		});
	}, null, true, 'America/Toronto');
	job.start();
}

module.exports = {
	getStonks,
	postStonks,
	stonkJobs
};
