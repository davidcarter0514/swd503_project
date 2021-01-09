const Appointment = require("../../models/Appointment");

exports.create = async (req, res) => {
    const userID = req.session.userID;
    const childID = req.body.childID;
    const title = req.body.title;
    if (!userID || !childID || !title) {
        res.json({result: 'error'});
        console.log('error');
        return;
    }
    try {
        await Appointment.create({
            title: title, 
            datetime: req.body.datetime,
            location: req.body.location,
            child: childID,
            owner: userID
        }, function(error, item) {
            res.json(item);
        });
    } catch (e) {
        res.json({result: 'error could not create an appointment'});
    }
};

exports.read = async (req, res) => {
    try {
        // const childID = req.params.id;
        // const userID = req.session.userID;
        const appointmentID = req.body.appointmentID;
        if (!appointmentID) {
            res.json({result: 'error'});
            console.log('error');
            return;
        }
        await Appointment.findById({appointmentID}, function(error, item) {
            res.json(item);
        });
    } catch (e) {
        res.json({result: 'error could not find appointment'});
    }
};

exports.delete = async (req, res) => {
    const userID = req.session.userID;
    const appointmentID = req.body.id;
    try {        
        const appointment = await Appointment.findById(appointmentID);
        if (userID!=appointment.owner) {
            res.json({result: 'error'});
            console.log('error');
            return;
        }

        await Appointment.findByIdAndRemove(appointmentID);

    } catch (e) {
        res.json({result: 'error could not delete appointment'});
    }
};