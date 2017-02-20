import Promise from 'bluebird';
import app from '../server';
import { ReviewDiff } from '../models';
import { encryptPhone } from '../utilities/encryption';
import { generateTextCode } from '../utilities/generateHash';



export function postReviewDiff(req, res, next) {	
	const phoneHash = encryptPhone(req.body.phone);
	const locData = { zipcode: req.body.zipcode };
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
