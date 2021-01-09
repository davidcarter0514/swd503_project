const Appointment = require("../models/Appointment");
const Child = require("../models/Child");

exports.list = async (req, res) => {
    try {
        const childID = req.params.id;
        const user = req.session.userID;
        const appointments = await Appointment.find({$and: [{owner: user}, {child: childID }]}).sort({datetime: -1});
        const child = await Child.findById(childID);
        res.render("appointments", { appointments: appointments, child: child});
    } catch (e) {
        res.status(404).send({message: 'could not list appointments'});
    }
};

// exports.create = async (req, res) => {
//     try {
//         const userID = req.session.userID;
//         const childID = req.params.id;
//         await Appointment.create({
//             title: req.body.name, 
//             datetime: req.body.datetime,
//             location: req.body.location,
//             child: childID,
//             owner: userID
//         });
//         res.redirect(`/child/${childID}/appointments?message=appointment added`);
//     } catch (e) {
//         if (e.errors) {
//             console.log(e.errors);
//             res.render('appointments', {errors: e.errors});
//             return;
//         }
//         return res.status(400).send({
//             message: JSON.parse(e),
//         });
//     }
// };

exports.read = async (req, res) => {
    try {
        const childID = req.params.id;
        const user = req.session.userID;
        const appointmentID = req.params.appointmentID;
        const appointment = await Appointment.findById(appointmentID);
        res.render("update-appointment", { appointment: appointment, childID: childID});
    } catch (e) {
        res.status(404).send({message: 'could not read appointment'});
    }
};

exports.update = async (req, res) => {
    const childID = req.params.id;
    const userID = req.session.userID;
    const appointmentID = req.params.appointmentID;
    try {
        const appointment = await Appointment.updateOne({_id: appointmentID}, {title: req.body.title, datetime: req.body.date, location: req.body.location});
        res.redirect(`/child/${childID}/appointments`);
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('update-appointment', {errors: e.errors});
            return;
        }
        return res.status(400).send({
            message: 'could not update appointment'
        });
    }
};
