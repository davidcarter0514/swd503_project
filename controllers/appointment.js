const Appointment = require("../models/Appointment");
const Child = require("../models/Child");

exports.list = async (req, res) => {
    try {
        const childID = req.params.id;
        const user = req.session.userID;
        const appointments = await Appointment.find({$and: [{owner: user}, {child: childID }]}).sort({datetime: -1});
        const child = await Child.findById(childID);
        if (user!=child.owner) {
            res.redirect("/children?message=invalid access");
            return;
        }

        res.render("appointments", { appointments: appointments, child: child});
    } catch (e) {
        res.status(404).send({message: 'could not list appointments'});
    }
};
