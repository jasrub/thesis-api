import Promise from 'bluebird';
if (process.env.NODE_ENV !== 'production') {
	require('./config.js');
}

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
	singleBlind: {
		type: Sequelize.BOOLEAN,
	},
	doubleBlind: {
		type: Sequelize.BOOLEAN,
	},
	accepted: {
		type: Sequelize.BOOLEAN,
	},
	reviewDuration: {
		type: Sequelize.INTEGER,
	},

	
});


const db = {
	ReviewDiff: ReviewDiff,
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
