import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from 'cors';

/* -------------------------------- */
/* Initialize development variables */
/* -------------------------------- */
if (process.env.NODE_ENV !== 'production') {
	require('./config.js');
	console.debug = function() {};
}
// console.debug = console.info;
console.debug = function() {};
/* -------------------------------- */
/* -------------------------------- */

const app = express();
export default app;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());


/* -------- */
/* Configure app CORS */
/* -------- */
const whitelist = [
	// Localhost
	'http://localhost:3000',

	// Primary
	'https://news-explore.um-dokku.media.mit.edu',
];

const corsOptions = {
	origin: function (origin, callback) {
		// This assumes the browser implements CORS. origin being undefined means the request is made on a local route
		const originIsWhitelisted = whitelist.indexOf(origin) !== -1 || origin === undefined;
		callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
	},
	methods: 'POST, GET, PUT, DELETE, OPTIONS',
	allowHeaders: 'X-Requested-With, Content-Type',
	credentials: true,
};
app.use(cors(corsOptions));

/* -------------------- */
/* -------------------- */

if (process.env.WORKER !== 'true') {

	// Catch the browser's favicon request. You can still
	// specify one as long as it doesn't have this exact name and path.
	app.get('/favicon.ico', function(req, res) {
		res.writeHead(200, { 'Content-Type': 'image/x-icon' });
		res.end();
	});

	app.use('/static', express.static(path.resolve(__dirname, 'static')));

	app.use(function (err, req, res, next) {
		// Handle errors.
		// console.log('Error! ' + err + ', ' + next);
		console.log('Error! ' + err);
		next();
	});

	/* ------------------- */
	/* API Endpoints */
	/* ------------------- */
	require('./routes/story.js');
    require('./routes/descriptor.js');

	/* ------------------- */
	/* ------------------- */

	const port = process.env.PORT || 9876;
	app.listen(port, (err) => {
		if (err) { console.error(err); }
		console.info('----\n==> 🌎  API is running on port %s', port);
		console.info('==> 💻  Send requests to http://localhost:%s', port);
	});
}
