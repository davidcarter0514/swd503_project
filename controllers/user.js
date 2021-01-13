const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.render('index', {errors: {email: {message: 'email not found'}}})
            return;
        }

        const match = await bcrypt.compare(req.body.password, user.password);

        if (match) {
            req.session.userID = user._id;
            res.redirect('/children');
            return;
        }

        res.render('index', {errors: {password: {message: 'password does not match'}}})
    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e)
        });
    }
};

exports.create = async (req, res) => {
    try {

        const user = new User({ email: req.body.email, password: req.body.password });
        await user.save();
        res.redirect('/children?message=user saved')
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('create-user', { errors: e.errors })
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
};