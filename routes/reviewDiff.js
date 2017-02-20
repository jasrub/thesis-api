import Promise from 'bluebird';
import app from '../server';
import { ReviewDiff } from '../models';
import { encryptString } from '../utilities/encryption';



export function postReviewDiff(req, res, next) {	
	ReviewDiff.create({
		before: req.body.before,
		after: req.body.after,
		numReviewers: req.body.numReviewers,
		singleBlind: req.body.singleBlind,
		doubleBlind: req.body.doubleBlind,
		reviewDuration: req.body.reviewDuration,
		accepted: req.body.accepted,
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
