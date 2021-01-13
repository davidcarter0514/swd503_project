const Expense = require("../../models/Expense");
const Appointment = require("../../models/Appointment");

exports.create = async (req, res) => {
    const userID = req.session.userID;
    const appointmentID = req.body.appointmentID;
    if (!userID || !appointmentID) {
        res.json({result: 'error'});
        console.log('error');
        return;
    }
    try {
        const appointment = await Appointment.findById(appointmentID);
        if (userID!=appointment.owner) {
            res.json({result: 'error - invalid appointment access'});
            console.log('error - invalid appointment access');
            return;
        }
        const expense = await Expense.create({
            type: req.body.type,
            mileage: req.body.mileage,
            amount: req.body.amount,
            appointment: appointment._id,
            appointment_title: appointment.title,
            appointment_date_string: Intl.DateTimeFormat('en-GB',{year: 'numeric', month: 'numeric', day: 'numeric'}).format(appointment.date),
            appointment_date: appointment.date,
            appointment_location: appointment.location,
            child: appointment.child,
            owner: userID
        });
        await Appointment.updateOne({"_id": appointmentID}, {$push: {expenses: expense._id}});
        res.json(expense);
    } catch (e) {
        res.json({result: 'error could not create an expense'});
    }
};

exports.read = async (req, res) => {
    try {
        const userID = req.session.userID;
        const expenseID = req.body.expenseID;
        if (!expenseID) {
            res.json({result: 'error - expenseID not set'});
            console.log('error - expenseID not set');
            return;
        }
        const expense = await Expense.findById(expenseID);
        if (userID!=expense.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        res.json(expense);
    } catch (e) {
        res.json({result: 'error could not find expense'});
    }
};


exports.update = async (req, res) => {
    const userID = req.session.userID;
    const expenseID = req.body.expenseID;
    try {
        if (!expenseID) {
            res.json({result: 'error - expenseID not set'});
            console.log('error - expenseID not set');
            return;
        }
        const expense = await Expense.findById(expenseID);
        if (userID!=expense.owner) {
            res.json({result: 'error - invalid access'});
            console.log('error - invalid access');
            return;
        }
        await Expense.findByIdAndUpdate(
            {_id: expenseID}, 
            {
                type: req.body.type,
                mileage: req.body.mileage,
                amount: req.body.amount
            },
            {new: true},
            function(error, item) {
                res.json(item);
            });
    } catch (e) {
        res.json({result: 'error could not update expense'});
    }
};

exports.delete = async (req, res) => {
    const userID = req.session.userID;
    const expenseID = req.body.id;
    try {        
        const expense = await Expense.findById(expenseID);
        if (userID!=expense.owner) {
            res.json({result: 'error'});
            console.log('error');
            return;
        }
        await Expense.findByIdAndRemove(expenseID);
        await Appointment.updateOne({"_id": expense.appointment}, {$pull: {expenses: expenseID}});

    } catch (e) {
        res.json({result: 'error could not delete expense'});
    }
};
