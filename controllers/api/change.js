const Change = require("../../models/Change");
const Child = require("../../models/Child");

exports.create = async (req, res) => {
    const userID = req.session.userID;
    const childID = req.body.childID;
    if (!userID || !childID) {
        res.json({result: 'Error - user or child not set'});
        console.log('Error - user or child not set');
        return;
    }
    try {
        const child = await Child.findById(childID);
        if (userID!=child.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        await Change.create({
            datetime: req.body.datetime,
            type: req.body.type,
            notes: req.body.notes, 
            child: childID,
            owner: userID
        }, function(error, item) {
            res.json(item);
        });
    } catch (e) {
        res.json({result: 'error could not create change'});
    }
};

exports.read = async (req, res) => {
    try {
        const userID = req.session.userID;
        const changeID = req.body.changeID;
        if (!changeID) {
            res.json({result: 'error - changeID not set'});
            console.log('error - changeID not set');
            return;
        }
        const change = await Change.findById(changeID);
        if (userID!=change.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        res.json(change);
    } catch (e) {
        res.json({result: 'error could not find change'});
    }
};

exports.update = async (req, res) => {
    const userID = req.session.userID;
    const changeID = req.body.changeID;
    try {
        if (!changeID) {
            res.json({result: 'error - changeID not set'});
            console.log('error - changeID not set');
            return;
        }
        const changecheck = await Change.findById(changeID);
        if (userID!=changecheck.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        await Change.findByIdAndUpdate(
            {_id: changeID}, 
            {type: req.body.type, datetime: req.body.datetime, notes: req.body.notes},
            {new: true},
            function(error, item) {
                res.json(item);
            });
    } catch (e) {
        res.json({result: 'error could not update change'});
    }
};

exports.delete = async (req, res) => {
    const userID = req.session.userID;
    const changeID = req.body.id;
    try {        
        const change = await Change.findById(changeID);
        if (userID!=change.owner) {
            res.json({result: 'error user is not owner of record'});
            console.log('error user is not owner of record');
            return;
        }

        await Change.findByIdAndRemove(changeID);

    } catch (e) {
        res.json({result: 'error could not delete change'});
    }
};