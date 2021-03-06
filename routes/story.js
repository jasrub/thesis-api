import app from '../server';
import {  Story, DescriptorsResult,  sequelize } from '../models';
import google from 'googleapis';
if (process.env.NODE_ENV !== 'production') {
    require('../config.js');
}

const config = {
    key: process.env.GOOGLE_API_KEY,
    cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
};

var customsearch = google.customsearch('v1');

export function getStories(req, res, next) {
    const now = new Date('2018,2,15');
    let before = new Date('2018,2,14');
    // before.setDate(now.getDate() - 2);
    console.log(now);
    console.log(before);
    return Story.findAll({
        where: {
            publishDate: {
                $lt: now,
                $gt: before
            }
        },
        include:[{model:DescriptorsResult, attributes:['descriptorId', 'score']}]
    })
        .then(function(stories) {
            console.log(stories.length)
            const result = {};
            stories.forEach((story)=>{
                const obj = story.dataValues;
                obj.showImage = Math.random()>0.4;
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


export function getStoryImage(req, res, next) {

    const storyId = req.query.story
    Story.find({where:{'id': storyId}})
        .then((story)=>{
            const query = story.title;
            customsearch.cse.list({
                cx: config.cx,
                q: query,
                searchType:'image',
                auth: config.key,
                num: 1,
            }, function (err, resp) {
                if (err) {
                    return res.status(500).json(err);
                }
                // Got the response from custom search
                if (resp.items && resp.items.length > 0) {
                    // add image link to database
                    const link = resp.items[0].link;
                    story.image = link;
                    story.save();
                    // return link
                    return res.status(201).json(link);
                }
                else {
                    console.error('Image not found');
                    return res.status(201).json('');
                }
            });

        })
        .catch(function(err) {
            console.error('Error in getStoryImage: ', err);
            return res.status(500).json(err);
        });
}
app.get('/stories/image', getStoryImage);