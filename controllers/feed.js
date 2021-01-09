const Feed = require("../models/Feed");
const Child = require("../models/Child");

exports.list = async (req, res) => {
    try {
        const childID = req.params.id;
        const user = req.session.userID;
        const feeds = await Feed.find({$and: [{owner: user}, {child: childID }]}).sort({datetime: -1});
        const child = await Child.findById(childID);
        res.render("feeds", { feeds: feeds, child: child});
    } catch (e) {
        res.status(404).send({message: 'could not list feeds'});
    }
};

exports.read = async (req, res) => {
    try {
        const childID = req.params.id;
        const user = req.session.userID;
        const feedID = req.params.feedID;
        const feed = await Feed.findById(feedID);
        res.render("update-feed", { feed: feed, childID: childID});
    } catch (e) {
        res.status(404).send({message: 'could not read feed'});
    }
};

exports.update = async (req, res) => {
    const childID = req.params.id;
    const userID = req.session.userID;
    const feedID = req.params.feedID;
    try {
        const feed = await Feed.updateOne({_id: feedID}, {title: req.body.title, datetime: req.body.date, location: req.body.location});
        res.redirect(`/child/${childID}/feeds`);
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('update-feed', {errors: e.errors});
            return;
        }
        return res.status(400).send({
            message: 'could not update feed'
        });
    }
};
