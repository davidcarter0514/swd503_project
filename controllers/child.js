const Child = require("../models/Child");
const Appointment = require("../models/Appointment");
const Change = require("../models/Change");
const Expense = require("../models/Expense");
const Feed = require("../models/Feed");
const Incident = require("../models/Incident");
const Report = require("../models/Report");

exports.list = async (req, res) => {
    try {
        const user = req.session.userID;
        const childs = await Child.find({owner: user}).sort({name: 1});
        res.render("children", { childs: childs});
    } catch (e) {
        res.status(404).send({message: 'could not list children'});
    }
};

exports.create = async (req, res) => {
    try {
        const child = await Child.create({
            name: req.body.name, 
            dob: req.body.dob,
            owner: req.session.userID
        });
        res.redirect(`/child/${child._id}`);
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('add-child', {errors: e.errors});
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
};

exports.read = async (req, res) => {
    const id = req.params.id;
    const user = req.session.userID;
    try {
        const child = await Child.findById(id);
        if (user!=child.owner) {
            res.redirect("/children?message=invalid access");
            return;
        }
        res.render('child', { child: child });
    } catch (e) {
        res.status(404).send({
            message: `could find child ${id}.`,
        });
    }
};

exports.edit = async (req, res) => {
    const id = req.params.id;
    const user = req.session.userID;
    try {
        const child = await Child.findById(id);
        if (user!=child.owner) {
            res.redirect("/children?message=invalid access");
            return;
        }
        res.render('edit-child', { child: child , errors: {} });
    } catch (e) {
        res.status(404).send({
            message: `could find child ${id}.`,
        });
    }
};

exports.update = async (req, res) => {
    const id = req.params.id;
    const user = req.session.userID;
    try {
        const child = await Child.findById(id);
        if (user!=child.owner) {
            res.redirect("/children?message=invalid access");
            return;
        }
        const newchild = await Child.findByIdAndUpdate(
            {_id: child._id},
            {
                name: req.body.name, 
                dob: req.body.dob
            },
            {new: true}
            );

        res.render('child', { child: newchild , errors: {} });
    } catch (e) {
        res.status(404).send({
            message: `could find child ${id}.`,
        });
    }
};

exports.delete = async (req, res) => {
    const id = req.params.id;
    const user = req.session.userID;
    try {
        const child = await Child.findById(id);
        if (user!=child.owner) {
            res.redirect("/children?message=invalid access");
            return;
            }
        await Child.findByIdAndRemove(id);
        await Appointment.deleteMany({child: id});
        await Change.deleteMany({child: id});
        await Expense.deleteMany({child: id});
        await Feed.deleteMany({child: id});
        await Incident.deleteMany({child: id});
        await Report.deleteMany({child: id});

        res.redirect("/children");
    } catch (e) {
        res.status(404).send({
            message: `could not delete  record ${id}.`,
        });
    }
};