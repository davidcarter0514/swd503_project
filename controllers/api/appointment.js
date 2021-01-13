const Appointment = require("../../models/Appointment");
const Expense = require("../../models/Expense");
const Child = require("../../models/Child");

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
        const child = await Child.findById(childID);
        if (userID!=child.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        await Appointment.create({
            title: title, 
            date: req.body.date,
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
        const userID = req.session.userID;
        const appointmentID = req.body.appointmentID;
        if (!appointmentID) {
            res.json({result: 'error - appointmentID not set'});
            console.log('error - appointmentID not set');
            return;
        }
        const appointment = await Appointment.findById(appointmentID);
        if (userID!=appointment.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        res.json(appointment);
    } catch (e) {
        res.json({result: 'error could not find appointment'});
    }
};


exports.update = async (req, res) => {
    const userID = req.session.userID;
    const appointmentID = req.body.appointmentID;
    try {
        if (!appointmentID) {
            res.json({result: 'error - appointmentID not set'});
            console.log('error - appointmentID not set');
            return;
        }
        const appointmentcheck = await Appointment.findById(appointmentID);
        if (userID!=appointmentcheck.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        const appointment = await Appointment.findByIdAndUpdate(
            {_id: appointmentID}, 
            {
                date: req.body.date,
                title: req.body.title,
                location: req.body.location
            },
            {new: true}
            );
        
        await Expense.updateMany(
            {appointment: appointmentID},
            {
                appointment_date_string: Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(new Date(req.body.date)),
                appointment_date: req.body.date,
                appointment_title: req.body.title,
                appointment_location: req.body.location
            }
        );
        res.json(appointment);
    } catch (e) {
        res.json({result: 'error could not update appointment'});
    }
};

exports.delete = async (req, res) => {
    const userID = req.session.userID;
    const appointmentID = req.body.id;
    try {        
        const appointment = await Appointment.findById(appointmentID);
        if (userID!=appointment.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        await Appointment.findByIdAndRemove(appointmentID);
        await Expense.deleteMany({appointment: appointmentID});

    } catch (e) {
        res.json({result: 'error could not delete appointment'});
    }
};
