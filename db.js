const mongoose = require('mongoose');

const Schema = mongoose.Schema;
var blogSchema = new Schema({
	slug: String,
	title: String,
	summary: String,
	content: String
});

var concertSchema = new Schema({
	id: String,
	date: String,
	concert: String,
	location: String,
	ticketsUrl: String
});

var userSchema = new Schema({
	username: String,
	password: {},
	salt: String
});

var songSchema = new Schema({
	title: String,
	artwork: String,
	releaseDate: Date,
	soundcloud: String,
	spotify: String,
	purchaseLinks: Array
});

function MongoClient() {
	mongoose.connect('mongodb://mongo/atx', {useNewUrlParser: true});

	var db = mongoose.connection;

	db.on('error', () => {
		console.error.bind(console, 'connection error:');
		setTimeout(() => mongoose.connect('mongodb://mongo/atx', {useNewUrlParser: true}), 1000);
	});
}

let mongoClient = new MongoClient();

module.exports = {
	mongoose,
	blogSchema,
	concertSchema,
	userSchema,
	songSchema
};
