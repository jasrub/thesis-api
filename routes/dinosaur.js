import Promise from 'bluebird';
import app from '../server';
import { Dinosaur } from '../models';



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
