const Expense = require("../models/Expense");
const Child = require("../models/Child");
const Appointment = require("../models/Appointment");
const {Parser} = require("json2csv");

exports.list = async (req, res) => {
    try {
        const appointmentID = req.params.appointmentID;
        const childID = req.params.id;
        const user = req.session.userID;
        const child = await Child.findById(childID);
        if (user!=child.owner) {
            res.redirect("/children?message=invalid access");
            return;
        }
        const expenses = await Expense.find({$and: [{owner: user},{appointment: appointmentID }]}).sort({createdAt: -1});
        const appointment = await Appointment.findById(appointmentID);
        res.render("expenses", { expenses: expenses, appointment: appointment, child: child});
    } catch (e) {
        res.status(404).send({message: 'could not list expenses'});
    }
};

exports.summary = async (req, res) => {
    try {
        const user = req.session.userID;
        const expenses = await Expense.find({owner: user}).populate('appointment').populate('child').sort({appointment_date: -1, createdAt: 1});
        res.render("expenses-summary", { expenses: expenses });
    } catch (e) {
        res.status(404).send({message: 'could not summarise expenses'});
    }
};

exports.download = async (req, res) => {
    try {
        const user = req.session.userID;
        const expenses = await Expense.find({owner: user}).populate('child').sort({appointment_date: -1, createdAt: 1});
        const fields = [
            {
                label: 'Date',
                value: 'appointment_date_string'
            },
            {
                label: 'Child',
                value: 'child.name'
            },
            {
                label: 'Appointment',
                value: 'appointment_title'
            },
            {
                label: 'Location',
                value: 'appointment_location'
            },
            {
                label: 'Expense Type',
                value: 'type'
            },
            {
                label: 'Mileage',
                value: 'mileage'
            },
            {
                label: 'Amount',
                value: 'amount'
            }
        ];
        const json2csv = new Parser({fields});
        const csv = json2csv.parse(expenses);
        res.header('Content-Type','text/csv');
        res.attachment('expenses.csv');
        return res.send(csv);
    } catch (e) {
        res.status(404).send({message: 'could not download expenses'});
    }
}