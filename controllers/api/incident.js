const Incident = require("../../models/Incident");
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
        await Incident.create({
            date: req.body.date,
            title: req.body.title,
            description: req.body.description,
            child: childID,
            owner: userID
        }, function(error, item) {
            res.json(item);
        });
    } catch (e) {
        res.json({result: 'error could not create incident'});
    }
};

exports.read = async (req, res) => {
    try {
         const userID = req.session.userID;
        const incidentID = req.body.incidentID;
        if (!incidentID) {
            res.json({result: 'error - incidentID not set'});
            console.log('error - incidentID not set');
            return;
        }
        const incident = await Incident.findById(incidentID);
        if (userID!=incident.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        res.json(incident);
    } catch (e) {
        res.json({result: 'error could not find incident'});
    }
};

exports.update = async (req, res) => {
    const userID = req.session.userID;
    const incidentID = req.body.incidentID;
    try {
        if (!incidentID) {
            res.json({result: 'error - incidentID not set'});
            console.log('error - incidentID not set');
            return;
        }
        const incidentcheck = await Incident.findById(incidentID);
        if (userID!=incidentcheck.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        await Incident.findByIdAndUpdate(
            {_id: incidentID}, 
            {
                date: req.body.date,
                title: req.body.title,
                description: req.body.description
            },
            {new: true},
            function(error, item) {
                res.json(item);
            });
    } catch (e) {
        res.json({result: 'error could not update incident'});
    }
};

exports.delete = async (req, res) => {
    const userID = req.session.userID;
    const incidentID = req.body.id;
    try {        
        const incident = await Incident.findById(incidentID);
        if (userID!=incident.owner) {
            res.json({result: 'error user is not owner of record'});
            console.log('error user is not owner of record');
            return;
        }

        await Incident.findByIdAndRemove(incidentID);

    } catch (e) {
        res.json({result: 'error could not delete incident'});
    }
};