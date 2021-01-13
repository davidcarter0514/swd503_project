const Report = require("../../models/Report");
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
        await Report.create({
            period: req.body.period,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            report: req.body.report,
            child: childID,
            owner: userID
        }, function(error, item) {
            res.json(item);
        });
    } catch (e) {
        res.json({result: 'error could not create report'});
    }
};

exports.read = async (req, res) => {
    try {
        const userID = req.session.userID;
        const reportID = req.body.reportID;
        if (!reportID) {
            res.json({result: 'error - reportID not set'});
            console.log('error - reportID not set');
            return;
        }
        const report = await Report.findById(reportID);
        if (userID!=report.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        res.json(report);
    } catch (e) {
        res.json({result: 'error could not find report'});
    }
};

exports.update = async (req, res) => {
    const userID = req.session.userID;
    const reportID = req.body.reportID;
    try {
        if (!reportID) {
            res.json({result: 'error - reportID not set'});
            console.log('error - reportID not set');
            return;
        }
        const report = await Report.findById(reportID);
        if (userID!=report.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        await Report.findByIdAndUpdate(
            {_id: reportID}, 
            {
                period: req.body.period,
                startdate: req.body.startdate,
                enddate: req.body.enddate,
                report: req.body.report
            },
            {new: true},
            function(error, item) {
                res.json(item);
            });
    } catch (e) {
        res.json({result: 'error could not update report'});
    }
};

exports.delete = async (req, res) => {
    const userID = req.session.userID;
    const reportID = req.body.id;
    try {        
        const report = await Report.findById(reportID);
        if (userID!=report.owner) {
            res.json({result: 'error user is not owner of record'});
            console.log('error user is not owner of record');
            return;
        }

        await Report.findByIdAndRemove(reportID);

    } catch (e) {
        res.status(404).send({message: 'error could not delete report'});
    }
};

exports.search = async (req, res) => {
    const userID = req.session.userID;
    const searchQuery = req.body.searchQuery;
    const childID = req.body.childID;

    if (!searchQuery) {
        return res.json([]);
    }

    try {
        const reports = await Report.find(
            {$text: {$search: searchQuery}, child: childID, owner: userID},
            {score: {$meta: "textScore"}}
        ).sort({startdate: -1})
        res.json(reports);
    } catch (e) {
        res.status(404).send({message: 'error could not perform search'});
    }
};