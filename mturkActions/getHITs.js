import mturk from 'mturk-api';
import Promise from 'bluebird';
import fs from 'fs';
import path from 'path';
import xmlescape from 'xml-escape';
require('../config.js');

const config = {
	access: process.env.AWS_ACCESS_KEY_ID,
	secret: process.env.AWS_SECRET_ACCESS_KEY,
	sandbox: true // CHANGE EXTERNAL QUESTION URL
};

let mturkClient;

mturk.createClient(config)
.then(function(api) {
	mturkClient = api;
	return api;
})

// .then(function() { 
// 	// Get Balance. Set to $10,000 if sandbox is true
// 	return mturkClient.req('GetAccountBalance')
// 	.then(function(res) {
// 	    console.log('Account Balance ', JSON.stringify(res, null, 2));
// 	});
// })

// .then(function() { 
// 	// Search HITs
// 	return api.req('SearchHITs', { PageSize: 10 })
// 	.then(function(res){
// 		console.log('Got HITs ', JSON.stringify(res, null, 2));
// 	});
// })

.then(function() { 
	// Create HITs
	return new Promise(function(resolve, reject) {
		fs.readFile(path.join(__dirname, './externalQuestion.xml'), 'utf8', function (err, data) {
			if (err) { reject(err); }
			resolve(xmlescape(data));
		});
	})
	.then(function(xmlQuestion) {
		const params = {
			Title: 'Test our MTurk Pipeline (Can complete in 40s)',
			Description: 'Simply fill in example text and test our submission/approval pipeline',
			Question: xmlQuestion, // IMPORTANT: XML NEEDS TO BE ESCAPED! 
			// AssignmentDurationInSeconds: 3600, // Allow 60 minutes to answer 
			AssignmentDurationInSeconds: 360, // Allow 60 minutes to answer 
			AutoApprovalDelayInSeconds: 86400 * 1, // 1 day auto approve 
			MaxAssignments: 8, // 1 worker responses 
			LifetimeInSeconds: 86400 * 1, // Expire in 1 days 
			Reward: { CurrencyCode: 'USD', Amount: 0.15 },
		};
		return mturkClient.req('CreateHIT', params);
	})
	.then(function(res) {
		console.log('HITs Created ', JSON.stringify(res, null, 2));
	});
})
// .then(function() { 
// 	// Approve HIT
// 	return mturkClient.req('ApproveAssignment', { AssignmentId: '3DEL4X4EL7WNEKLCMMMRP18QE99YXB' })
// 	.then(function(res){
// 		console.log('HIT Approved ', JSON.stringify(res, null, 2));
// 	});	
// })
.catch(function(err) {
	console.log('Error: ', err);
});
