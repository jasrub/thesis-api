import Promise from 'bluebird';
import request from 'request-promise';
import mturk from 'mturk-api';
import app from '../server';
import { mturkConfig, Dinosaur } from '../models';

export function postDinosaur(req, res, next) {	
	Dinosaur.create({
		reviewContent: req.body.reviewContent,
		reviewRating: req.body.reviewRating,
		age: req.body.age,
		levelOfEducation: req.body.levelOfEducation,
		isScientist: req.body.isScientist,
		hasReviewed: req.body.hasReviewed,
		hasBeenReviewed: req.body.hasBeenReviewed,
		interestedInTopic: req.body.interestedInTopic,
		field: req.body.field,
		feedback: req.body.feedback,
		usedInterface: req.body.usedInterface,
	})
	.then(function(result) {
		return res.status(201).json(true);
	})
	.catch(function(err) {
		console.error('Error in postDinosaur: ', err);
		return res.status(500).json(err);
	});
}
app.post('/dinosaur', postDinosaur);

export function postBeef(req, res, next) {
	console.log(req.body);
	const url = process.env.IS_PRODUCTION_API === 'TRUE'
		? `https://www.mturk.com/mturk/externalSubmit?assignmentId=${req.body.assignmentId}&foo=bar`
		: `http://workersandbox.mturk.com/mturk/externalSubmit?assignmentId=${req.body.assignmentId}&foo=bar`; // HTTPS is failing here, even though the docs mandate it. No clue...

	return request({
		method: 'POST',
		uri: url,
		form: {
			assignmentId: req.body.assignmentId,
			foo: 'bar',
		}
	})
	.then(function(amazonSubmitResponse) {
		console.log('HIT Submitted ', JSON.stringify(amazonSubmitResponse, null, 2));
		return mturk.createClient(mturkConfig);
	})
	.then(function(mturkClient) {
		console.log('this is my assignment id', req.body.assignmentId);
		return mturkClient.req('ApproveAssignment', { AssignmentId: req.body.assignmentId });	
	})
	.then(function(amazonResponse) {
		console.log('HIT Approved ', JSON.stringify(amazonResponse, null, 2));
		return res.status(201).json(true);	
	})
	.catch(function(err) {
		console.error('Error in postBeef: ', err);
		return res.status(500).json(err);
	});
	

	Dinosaur.create({
		reviewContent: req.body.reviewContent,
		reviewRating: req.body.reviewRating,
		age: req.body.age,
		levelOfEducation: req.body.levelOfEducation,
		isScientist: req.body.isScientist,
		hasReviewed: req.body.hasReviewed,
		hasBeenReviewed: req.body.hasBeenReviewed,
		interestedInTopic: req.body.interestedInTopic,
		field: req.body.field,
		feedback: req.body.feedback,
		usedInterface: req.body.usedInterface,
	})
	.then(function(result) {
		return res.status(201).json(true);
	})
	.catch(function(err) {
		console.error('Error in postBeef: ', err);
		return res.status(500).json(err);
	});
}
app.post('/beef', postBeef);
