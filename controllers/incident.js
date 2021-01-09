const Incident = require("../models/Incident");
const Child = require("../models/Child");

exports.list = async (req, res) => {
    try {
        const childID = req.params.id;
        const user = req.session.userID;
        const incidents = await Incident.find({$and: [{owner: user}, {child: childID }]}).sort({datetime: -1});
        const child = await Child.findById(childID);
        res.render("incidents", { incidents: incidents, child: child});
    } catch (e) {
        res.status(404).send({message: 'could not list incidents'});
    }
};

