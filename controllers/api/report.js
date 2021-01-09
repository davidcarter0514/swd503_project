const Report = require("../../models/Report");

exports.create = async (req, res) => {
    const userID = req.session.userID;
    const childID = req.body.childID;
    if (!userID || !childID) {
        res.json({result: 'Error - user or child not set'});
        console.log('Error - user or child not set');
        return;
    }
    try {
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
        // const childID = req.params.id;
        // const userID = req.session.userID;
        const reportID = req.body.reportID;
        if (!reportID) {
            res.json({result: 'error - reportID not set'});
            console.log('error - reportID not set');
            return;
        }
        const report = await Report.findById(reportID);
        res.json(report);
    } catch (e) {
        res.json({result: 'error could not find report'});
    }
};

exports.update = async (req, res) => {
    const childID = req.params.id;
    const userID = req.session.userID;
    const reportID = req.body.reportID;
    try {
        if (!reportID) {
            res.json({result: 'error - reportID not set'});
            console.log('error - reportID not set');
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
        res.json({result: 'error could not delete report'});
    }
};