const Feed = require("../../models/Feed");

exports.create = async (req, res) => {
    const userID = req.session.userID;
    const childID = req.body.childID;
    if (!userID || !childID) {
        res.json({result: 'Error - user or child not set'});
        console.log('Error - user or child not set');
        return;
    }
    try {
        await Feed.create({
            datetime: req.body.datetime,
            amount: req.body.amount, 
            child: childID,
            owner: userID
        }, function(error, item) {
            res.json(item);
        });
    } catch (e) {
        res.json({result: 'error could not create feed'});
    }
};

exports.read = async (req, res) => {
    try {
        // const childID = req.params.id;
        // const userID = req.session.userID;
        const feedID = req.body.feedID;
        if (!feedID) {
            res.json({result: 'error - feedID not set'});
            console.log('error - feedID not set');
            return;
        }
        const feed = await Feed.findById(feedID);
        res.json(feed);
    } catch (e) {
        res.json({result: 'error could not find feed'});
    }
};

exports.update = async (req, res) => {
    const childID = req.params.id;
    const userID = req.session.userID;
    const feedID = req.body.feedID;
    try {
        if (!feedID) {
            res.json({result: 'error - feedID not set'});
            console.log('error - feedID not set');
            return;
        }
        await Feed.findByIdAndUpdate(
            {_id: feedID}, 
            {amount: req.body.amount, datetime: req.body.datetime},
            {new: true},
            function(error, item) {
                res.json(item);
            });
    } catch (e) {
        res.json({result: 'error could not update feed'});
    }
};

exports.delete = async (req, res) => {
    const userID = req.session.userID;
    const feedID = req.body.id;
    try {        
        const feed = await Feed.findById(feedID);
        if (userID!=feed.owner) {
            res.json({result: 'error user is not owner of record'});
            console.log('error user is not owner of record');
            return;
        }

        await Feed.findByIdAndRemove(feedID);

    } catch (e) {
        res.json({result: 'error could not delete feed'});
    }
};