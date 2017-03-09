if (process.env.NODE_ENV !== 'production') {
	require('./config.js');
}

/* Initialize MTurk */
/* ---------------- */
// const mturkConfig = {
// 	access: process.env.AWS_ACCESS_KEY_ID,
// 	secret: process.env.AWS_SECRET_ACCESS_KEY,
// 	sandbox: process.env.IS_PRODUCTION_API !== 'TRUE',
// };
/* ---------------- */


const Sequelize = require('sequelize');

const useSSL = process.env.DATABASE_URL.indexOf('localhost') === -1;
console.log(useSSL);
const sequelize = new Sequelize(process.env.DATABASE_URL, { logging: false, dialectOptions: { ssl: useSSL } ,});

// Change to true to update the model in the database.
// NOTE: This being set to true will erase your data.
sequelize.sync({ force: false });

const Story = sequelize.define('Story', {
    mediaId: { type: Sequelize.INTEGER },
    title: { type: Sequelize.TEXT },
    url: { type: Sequelize.TEXT },
    publishDate: { type: Sequelize.TEXT },
    mediaName: { type: Sequelize.TEXT },
    collectDate: { type: Sequelize.TEXT },
    mediaUrl: { type: Sequelize.TEXT },},
    {timestamps: false}
);

const Descriptor = sequelize.define('Descriptor', {
    id: { type: Sequelize.TEXT, primaryKey: true },},
    {timestamps: false,}
);

const DescriptorsResult = sequelize.define('DescriptorsResults', {
    descriptorId: { type: Sequelize.TEXT },
	storyId: {type: Sequelize.TEXT},
	score: {type: Sequelize.DOUBLE},},
    {timestamps: false,});

DescriptorsResult.belongsTo(Descriptor, {foreignKey: 'descriptorId'});
Descriptor.hasMany(DescriptorsResult, {foreignKey: 'descriptorId'});
Story.hasMany(DescriptorsResult, { foreignKey: 'storyId' });
DescriptorsResult.belongsTo(Story, {foreignKey: 'storyId'});

sequelize.sync({ force: false });


const db = {
    Story: Story,
    Descriptor: Descriptor,
    DescriptorsResult: DescriptorsResult,
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// db.mturkConfig = mturkConfig;

module.exports = db;
