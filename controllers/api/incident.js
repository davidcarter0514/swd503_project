const Incident = require("../../models/Incident");

exports.create = async (req, res) => {
    const userID = req.session.userID;
    const childID = req.body.childID;
    if (!userID || !childID) {
        res.json({result: 'Error - user or child not set'});
        console.log('Error - user or child not set');
        return;
    }
    try {
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
        // const childID = req.params.id;
        // const userID = req.session.userID;
        const incidentID = req.body.incidentID;
        if (!incidentID) {
            res.json({result: 'error - incidentID not set'});
            console.log('error - incidentID not set');
            return;
        }
        const incident = await Incident.findById(incidentID);
        res.json(incident);
    } catch (e) {
        res.json({result: 'error could not find incident'});
    }
};

exports.update = async (req, res) => {
    const childID = req.params.id;
    const userID = req.session.userID;
    const incidentID = req.body.incidentID;
    try {
        if (!incidentID) {
            res.json({result: 'error - incidentID not set'});
            console.log('error - incidentID not set');
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