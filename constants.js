// Security constants
const WRONG_KEY = 'WRONG_KEY';
const VERIFY_ERROR = 'VERIFY_ERROR';
const VERIFY_SUCCESS = 'VERIFY_SUCCESS';

// Login constants
const WRONG_USER_PASS = 'WRONG_USER_PASS';
const LOGIN_ISSUE = 'LOGIN_ISSUE';
const NO_USER_PASS = 'NO_USER_PASS';

// Server constants
const PORT = 3000;
const API_GUIDE = {
	'get': {
		'blogs': {
			'/blogs': 'returns number of pages of blogs in system',
			'/blogs?page=[pageNumber]': 'returns 10 blogs based on the page number starting at 0',
			'/blogs?slug=[blogSlug]': 'returns a blog based on the slug'
		},
		'songs': {
			'/songs': 'returns list of songs'
		},
		'get-pub-key': {
			'/get-pub-key': 'returns the public key for the server'
		}
	},
	'post': {
		'booking': {
			'/booking': 'takes in data from booking form and sends off and email, returns with success/fail message'
		},
		'blogs': {
			'/blogs': 'takes in data for a blog post and creates it with a unique slug'
		},
		'songs': {
			'/song': 'posts a song with info passed in through the body'
		},
		'login': {
			'/login': 'takes in json object {\'username\': [username],\'password\': [password]} and returns login token if correct' 
		},
		'verify': {
			'/verify': 'takes in json oject {\'token\':[jwt token],\'key\':[public key]} and returns true if the jwt is correct'
		}
	}
};

module.exports = {
	WRONG_KEY,
	VERIFY_ERROR,
	WRONG_USER_PASS,
	LOGIN_ISSUE,
	NO_USER_PASS,
	PORT,
	API_GUIDE
};
