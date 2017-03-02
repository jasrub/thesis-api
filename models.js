import Promise from 'bluebird';
if (process.env.NODE_ENV !== 'production') {
	require('./config.js');
}

/* Initialize MTurk */
/* ---------------- */
const mturkConfig = {
	access: process.env.AWS_ACCESS_KEY_ID,
	secret: process.env.AWS_SECRET_ACCESS_KEY,
	sandbox: process.env.IS_PRODUCTION_API !== 'TRUE',
};
/* ---------------- */


const Sequelize = require('sequelize');

const useSSL = process.env.DATABASE_URL.indexOf('localhost:') === -1;
const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false, dialectOptions: { ssl: useSSL } });

// Change to true to update the model in the database.
// NOTE: This being set to true will erase your data.
sequelize.sync({ force: false });

const Dinosaur = sequelize.define('Dinosaur', {
	mode: { type: Sequelize.INTEGER },
	reviewContent: { type: Sequelize.TEXT },
	reviewRating: { type: Sequelize.INTEGER },
	offsetValues: { type: Sequelize.TEXT },
	offsetInteractions: { type: Sequelize.TEXT },
	timeOnReview: { type: Sequelize.TEXT },
	scrollValues: { type: Sequelize.TEXT },
	levelOfEducation: { type: Sequelize.TEXT },
	isScientist: { type: Sequelize.BOOLEAN },
	hasReviewed: { type: Sequelize.TEXT },
	hasBeenReviewed: { type: Sequelize.TEXT },
	interestedInTopic: { type: Sequelize.BOOLEAN },
	feedback: { type: Sequelize.TEXT },
	workerId: { type: Sequelize.TEXT },
	assignmentId: { type: Sequelize.TEXT },
	hitId: { type: Sequelize.TEXT },
});

const db = {
	Dinosaur: Dinosaur,
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.mturkConfig = mturkConfig;

module.exports = db;
