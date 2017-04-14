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
    id: {type: Sequelize.STRING, primaryKey: true},
    mediaId: { type: Sequelize.STRING},
    title: { type: Sequelize.TEXT },
    url: { type: Sequelize.TEXT },
    publishDate: { type: Sequelize.TEXT },
    mediaName: { type: Sequelize.TEXT },
    collectDate: { type: Sequelize.TEXT },
    mediaUrl: { type: Sequelize.TEXT },
    image: {type: Sequelize.TEXT},
    leftRight: {type: Sequelize.FLOAT},
    posNeg: {type: Sequelize.FLOAT},
    trend: {type: Sequelize.FLOAT},
    objective: {type: Sequelize.FLOAT},
    isMediaCloud: {type: Sequelize.BOOLEAN},
    isSuperglue: {type: Sequelize.BOOLEAN},
    },
);

const Descriptor = sequelize.define('Descriptor', {
    id: { type: Sequelize.TEXT, primaryKey: true },},
    {timestamps: false,}
);

const DescriptorsResult = sequelize.define('DescriptorsResult', {
    descriptorId: { type: Sequelize.TEXT },
	storyId: {type: Sequelize.TEXT},
	score: {type: Sequelize.DOUBLE},});

const Connection = sequelize.define('Connection', {
    origin: { type: Sequelize.TEXT },
    dest: { type: Sequelize.TEXT },
    count: { type: Sequelize.INTEGER },},
    {timestamps: false,}
);

const Label = sequelize.define('Label', {
        id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
        storyId: {type: Sequelize.TEXT},
        isMediaCloud: {type: Sequelize.BOOLEAN},
        isSuperglue: {type: Sequelize.BOOLEAN},
        leftRight: {type: Sequelize.FLOAT},
        posNeg: {type: Sequelize.FLOAT},
        trend: {type: Sequelize.FLOAT},
        objective: {type: Sequelize.FLOAT},
        isUsed: {type: Sequelize.BOOLEAN, defaultValue:false},},
        {omitNull:true}
);

DescriptorsResult.belongsTo(Descriptor, {foreignKey: 'descriptorId'});
Descriptor.hasMany(DescriptorsResult, {foreignKey: 'descriptorId'});

Connection.belongsTo(Descriptor, { foreignKey: 'origin' });
Descriptor.hasMany(Connection, { foreignKey: 'origin' });

Story.hasMany(DescriptorsResult, { foreignKey: 'storyId' });
DescriptorsResult.belongsTo(Story, {foreignKey: 'storyId'});

Story.hasMany(Label, { foreignKey: 'storyId' });



const db = {
    Story: Story,
    Descriptor: Descriptor,
    DescriptorsResult: DescriptorsResult,
    Connection: Connection,
    Label: Label,
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
// db.mturkConfig = mturkConfig;

module.exports = db;
