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
		'stonks': {
			'/stonks': 'returns the current reported stonk price from all users.'
		}
	},
	'post': {
		'stonks': {
			'/stonks?sell=true': 'takes in your name and your current stonk price in the body as variables called name and price',
			'/stonks?buy=true': 'takes in your buy price and ammount you bought in the body in variables called stonksBought and stonksPrice'
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
