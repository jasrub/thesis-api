import Promise from 'bluebird';
import app from '../server';
import { ReviewDiff } from '../models';
import { encryptString } from '../utilities/encryption';



export function postReviewDiff(req, res, next) {	
	return res.status(201).json('Running');

	ReviewDiff.create({
		
	})
	.then(function(result) {
		return res.status(201).json(true);
	})
	.catch(function(err) {
		console.error('Error in postReviewDiff: ', err);
		return res.status(500).json(err);
	});
}
app.post('/reviewdiff', postReviewDiff);
