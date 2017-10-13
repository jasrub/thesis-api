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

function parseFilters(filtersJSON) {
    const filters = JSON.parse(filtersJSON);
    const storyWhere = {};
    Object.keys(filters).forEach((filterName)=>{
        const filter = filters[filterName];
        storyWhere[filterName]={$between:[filter.min-0.01, filter.max+0.01]};
    });
    const now = new Date(2017, 10, 9);
    let before = new Date();
    before.setDate(now.getDate() - 1.5);
    storyWhere.publishDate =  {
        $lt: now,
        $gt: before
    };
    return storyWhere;
}

export function sortedDescriptors(req, res, next) {
    const storyWhere = parseFilters(req.query.filters);

    return Descriptor.findAll({
        include: [
            {model: DescriptorsResult,
                include:[{model: Story, where:storyWhere, attributes:['id'], required: true }],
                attributes: ['storyId', 'score'],
                order: 'score DESC',
                required: true,
                //separate: true,
                //limit:100, // if want limit, remove attributes. couldn't see any efficiency improvments
            },
        ],

    })
        .then(function(descriptors) {
            Story.count({where: storyWhere}).then(function (storiesCount) {
                const result = {};
                descriptors.forEach((desc) => {
                        const obj = desc.dataValues;
                        obj.score = obj.DescriptorsResults.reduce((acc, val) => acc + val.score, 0);
                        obj.numStories = obj.DescriptorsResults.length;
                        obj.storiesPercent = Math.round((obj.DescriptorsResults.length/storiesCount)*100);
                        obj.avgScore = obj.score / obj.numStories;
                        obj.DescriptorsResults.sort((a, b)=>(b.numStories-a.numStories));
                        result[desc.id] = obj
                    }
                );

                return res.status(201).json({'descriptors': result, 'storyCount': storiesCount});
            });
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

function getSourceCounts(filters) {
    const storyWhere = parseFilters(filters);
    return Story.aggregate('id', 'COUNT', {
        plain: false,
            where:storyWhere,
            group: [ 'mediaName' ],
            attributes: [ 'mediaName' ]});
}

export function sourceCounts(req, res, next) {
    return getSourceCounts(req.query.filters)
        .then(function (counts) {
            const result = {};
            counts.forEach((source) => {
                result[source.mediaName] = source.COUNT;
            });
            res.status(201).json(result);
        })
        .catch(function (err) {
            console.error('Error in sources count: ', err);
            return res.status(500).json(err);
        });
}
app.get('/descriptors/source_count', sourceCounts);
