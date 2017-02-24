import Promise from 'bluebird';
import mturk from 'mturk-api';
if (process.env.NODE_ENV !== 'production') {
	require('./config.js');
}

/* Initialize MTurk */
/* ---------------- */
const config = {
	access: process.env.AWS_ACCESS_KEY_ID,
	secret: process.env.AWS_SECRET_ACCESS_KEY,
	sandbox: true
};

const mturkClient = mturk.createClient(config).then(function(api) {
	return api;
});

/* ---------------- */


const Sequelize = require('sequelize');

const useSSL = process.env.DATABASE_URL.indexOf('localhost:') === -1;
const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false, dialectOptions: { ssl: useSSL } });

// Change to true to update the model in the database.
// NOTE: This being set to true will erase your data.
sequelize.sync({ force: false });


const ReviewDiff = sequelize.define('ReviewDiff', {
	before: {
		type: Sequelize.TEXT, 
		allowNull: false, 
	},
	after: { 
		type: Sequelize.TEXT, 
		allowNull: false, 
	},
	numReviewers: {
		type: Sequelize.INTEGER,
	},
	reviewType: {
		type: Sequelize.TEXT,
	},
	accepted: {
		type: Sequelize.BOOLEAN,
	},
	reviewDuration: {
		type: Sequelize.INTEGER,
	},
});

const Dinosaur = sequelize.define('Dinosaur', {
	reviewContent: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	reviewRating: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	age: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	levelOfEducation: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	isScientist: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
	},
	hasReviewed: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	hasBeenReviewed: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	interestedInTopic: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
	},
	field: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	feedback: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	usedInterface: {
		type: Sequelize.BOOLEAN,
	},
});

const db = {
	ReviewDiff: ReviewDiff,
	Dinosaur: Dinosaur,
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.mturkClient = mturkClient;

module.exports = db;
