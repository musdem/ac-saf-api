const mongoose = require('mongoose');
const CronJob = require('cron').CronJob;

const Schema = mongoose.Schema;

var userSchema = new Schema({
	username: String,
	password: {},
	salt: String,
	name: String,
	priceBought: Number,
	turnipsBought: Number
});

var stonkSchema = new Schema({
	name: String,
	price: Number
});

var fossilSchema = new Schema({
	name: String,
	selling: Boolean,
	item: String,
	price: Number
});

function MongoClient() {
	mongoose.connect('mongodb://mongo/saf', {useNewUrlParser: true});

	var db = mongoose.connection;

	db.on('error', () => {
		console.error.bind(console, 'connection error:');
		setTimeout(() => mongoose.connect('mongodb://mongo/saf', {useNewUrlParser: true}), 1000);
	});
}

let mongoClient = new MongoClient();

module.exports = {
	mongoose,
	userSchema,
	stonkSchema,
	fossilSchema
};
