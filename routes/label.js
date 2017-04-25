import app from '../server';
import { Label, sequelize } from '../models';

export function postLabel(req, res, next) {
    return Label.create({
        storyId: req.body.story.id,
        isMediaCloud: req.body.story.isMediaCloud,
        isSuperglue: req.body.story.isSuperglue,
        leftRight: req.body.filters.leftRight.val,
        posNeg: req.body.filters.posNeg.val,
        trend: req.body.filters.trend.val,
        objective: req.body.filters.objective.val,
        isUsed: false,
        sessionId: req.cookies['connect.sid'],
    })
        .then(function(result) {
            return res.status(201).json(true);
        })
        .catch(function(err) {
            console.error('Error in postDino: ', err);
            return res.status(500).json(err);
        });
}
app.post('/label', postLabel);