import app from '../server';
import { Descriptor, DescriptorsResult, Story, sequelize } from '../models';

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
app.get('/all_descriptors', getDescriptors);


export function sortedDescriptors(req, res, next) {
    return Descriptor.findAll({
        include: [ {model: DescriptorsResult,
            include: [ {model: Story, attributes: ['url', 'title'] }],
            order: ['score' , 'DESC']}, ],
        //attributes: [sequelize.fn('SUM', sequelize.col('DescriptorsResults.score')), 'totalScore']
        // order: [ [ DescriptorsResult, 'score', 'DESC' ]]

        //attributes: { include: [[sequelize.fn('COUNT', sequelize.col('DescriptorsResults')), 'no_stories']] }
        // attributes: [[sequelize.fn('COUNT', sequelize.col('DescriptorsResults')), 'no_stories']],
    })
        .then(function(descriptors) {
            console.log(descriptors)
            return res.status(201).json(descriptors);
        })
        .catch(function(err) {
            console.error('Error in getDescriptors: ', err);
            return res.status(500).json(err);
        });
}
app.get('/descriptors', sortedDescriptors);

export function search(req, res, next) {
    const param = req.query.q;
    return Descriptor.findAll({
        include: [ {model: DescriptorsResult, required:true,
            include: [ {model: Story, attributes: ['url', 'title'] }],
            order: ['score' , 'DESC']}, ],
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
app.get('/search', search);