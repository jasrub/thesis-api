import Promise from 'bluebird';
if (process.env.NODE_ENV !== 'production') {
	require('./config.js');
}

/* Initialize MTurk */
/* ---------------- */
const mturkConfig = {
	access: process.env.AWS_ACCESS_KEY_ID,
	secret: process.env.AWS_SECRET_ACCESS_KEY,
	sandbox: true
};
/* ---------------- */


const Sequelize = require('sequelize');

const useSSL = process.env.DATABASE_URL.indexOf('localhost:') === -1;
const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false, dialectOptions: { ssl: useSSL } });

// Change to true to update the model in the database.
// NOTE: This being set to true will erase your data.
sequelize.sync({ force: false });

const Dinosaur = sequelize.define('Dinosaur', {
	reviewContent: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	reviewRating: {
		type: Sequelize.INTEGER,
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
	feedback: {
		type: Sequelize.TEXT,
		allowNull: false,
	},
	workerId: {
		type: Sequelize.TEXT,
	},
	assignmentId: {
		type: Sequelize.TEXT,
	},
	hitId: {
		type: Sequelize.TEXT,
	},
});

const db = {
	Dinosaur: Dinosaur,
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.mturkConfig = mturkConfig;

module.exports = db;
