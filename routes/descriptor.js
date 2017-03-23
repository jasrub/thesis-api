import app from '../server';
import { Descriptor, DescriptorsResult, Story, Connection, sequelize } from '../models';

export function getDescriptors(req, res, next) {
    return Descriptor.findAll({})
        .then(function(descriptors) {
            return res.status(201).json(descriptors);
        })
        .catch(function(err) {
            console.error('Error in getDescriptors: ', err);
            return res.status(500).json(err);
        });
}
app.get('/descriptors/all', getDescriptors);


export function sortedDescriptors(req, res, next) {
    return Descriptor.findAll({
        include: [
            {model: DescriptorsResult,
                attributes: ['storyId', 'score'],
                order: 'score DESC',
            },
        ],

    })
        .then(function(descriptors) {
            return res.status(201).json(descriptors);
        })
        .catch(function(err) {
            console.error('Error in getDescriptors: ', err);
            return res.status(500).json(err);
        });
}
app.get('/descriptors/sorted', sortedDescriptors);

export function descriptorsConnections(req, res, next) {
    const param = req.query.q;
    return Connection.findAll({
        attributes: ['dest', 'count'],
        where: {origin: {$like:`${param}`}},
        order:'count DESC',
        limit:7,
    })
        .then(function(connections) {
            return res.status(201).json(connections);
        })
        .catch(function(err) {
            console.error('Error in getDescriptors: ', err);
            return res.status(500).json(err);
        });
}
app.get('/descriptors/related', descriptorsConnections);

export function search(req, res, next) {
    const param = req.query.q;
    return Descriptor.findAll({
        include: [ {model: DescriptorsResult, required:true,
            include: [ {model: Story, attributes: ['url', 'title', 'mediaName', 'isMediaCloud', 'isSuperglue'] }],
            order: 'score DESC'}, ],
        where: {id:{$like: `%${param}%`}}
        //attributes: [sequelize.fn('SUM', sequelize.col('DescriptorsResults.score')), 'totalScore']
        // order: [ [ DescriptorsResult, 'score', 'DESC' ]]

        //attributes: { include: [[sequelize.fn('COUNT', sequelize.col('DescriptorsResults')), 'no_stories']] }
        // attributes: [[sequelize.fn('COUNT', sequelize.col('DescriptorsResults')), 'no_stories']],
    })
        .then(function(descriptors) {
            return res.status(201).json(descriptors);
        })
        .catch(function(err) {
            console.error('Error in getDescriptors: ', err);
            return res.status(500).json(err);
        });
}
app.get('/descriptors/search', search);