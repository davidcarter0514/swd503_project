const Child = require("../models/Child");

exports.list = async (req, res) => {
    try {
        const user = req.session.userID;
        // const childs = await Child.find({owner: user}).sort({name: 1});
        const childs = await Child.aggregate(
            [
                {$match: { owner: user }},
                {$project: {id : 1, name: 1, owner: 1, dob: {$dateToString: {format: "%Y-%m-%d", date: "$dob" }}}},
                {$sort: {name: 1}}
            ]
        );
        res.render("children", { childs: childs});
    } catch (e) {
        res.status(404).send({message: 'could not list tasters'});
    }
};

exports.create = async (req, res) => {
    try {
        await Child.create({
            name: req.body.name, 
            dob: req.body.dob,
            owner: req.session.userID
        });
        res.redirect('/children/?message=Child profile has been created');
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

exports.edit = async (req, res) => {
    const id = req.params.id;
    const user = req.session.userID;
    try {
        const child = await Child.findById(id);
        if (user!=child.owner) {
            res.redirect("/children?message=invalid access");
            return;
        }
        res.render('child', { child: child , id: id });
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
        res.redirect("/children");
    } catch (e) {
        res.status(404).send({
            message: `could not delete  record ${id}.`,
        });
    }
};