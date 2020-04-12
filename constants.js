// Security constants
const WRONG_KEY = 'Signature error: Incorrect public key, please logout and login again.';
const VERIFY_ERROR = 'Verify error: Unable to verify user, please try again.';
const VERIFY_SUCCESS = 'VERIFY_SUCCESS';

// Login constants
const LOGIN_FAILURE = 'Incorrect username or password';
const LOGIN_ISSUE = 'Unable to log in, please try again later.';
const NO_USER_PASS = 'NO_USER_PASS';

// Server constants
const PORT = 3000;
const API_GUIDE = {
	'get': {
		'stonks': {
			'/stonks': 'returns the current reported stonk price from all users.'
		},
		'fossils': {
			'/fossils': 'returns all current fossil ads.'
		}
	},
	'post': {
		'stonks': {
			'/stonks?sell=true': 'takes in your name and your current stonk price in the body as variables called name and price',
			'/stonks?buy=true': 'takes in your buy price and ammount you bought in the body in variables called stonksBought and stonksPrice'
		},
		'fossils': {
			'/fossils/sell': 'takes in your name, itemId, and price and creates a selling ad',
			'/fossils/buy': 'takes in your name, itemId, and requested price and creates a wanted ad',
			'/fossils/delete': 'takes in your name and itemId and deletes your ad',
			'/fossils/own': 'takes in your name and itemId and updates the fossils you own'
		}
	}
};

module.exports = {
	WRONG_KEY,
	VERIFY_ERROR,
	LOGIN_FAILURE,
	LOGIN_ISSUE,
	NO_USER_PASS,
	PORT,
	API_GUIDE
};
