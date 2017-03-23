import app from '../server';
import {  Story,  sequelize } from '../models';

export function getStories(req, res, next) {
    return Story.findAll({})
        .then(function(stories) {
            const result = {};
            stories.forEach((story)=>{
                const obj = story.dataValues;
                result[story.id] = obj
            });
            return res.status(201).json(result);
        })
        .catch(function(err) {
            console.error('Error in getStories: ', err);
            return res.status(500).json(err);
        });
}
app.get('/stories/all', getStories);
