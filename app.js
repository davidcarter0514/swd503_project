require('dotenv').config();
const express = require('express');
const path = require('path');
const moongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressSession = require('express-session');

// Models
const User = require('./models/User');

// Controllers
const childController = require('./controllers/child');
const userController = require('./controllers/user');

const app = express();
app.set('view engine', 'ejs');

const {PORT, MONGODB_URI} = process.env;

// Connect to database
moongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
moongoose.connection.on('error', (err) => {
    console.log(err);
    console.log(
        "MongoDB connection error. Please make sure MongoDB is running."
    );
    process.exit();
});
// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(expressSession({
    secret: 'Foster Carers Portal',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: (14 * 24 * 3600 * 1000)}
}));

global.user = false;
app.use('*', async (req, res, next) => {
    if (req.session.userID && !global.user) {
        const user = await User.findById(req.session.userID);
        global.user = user;
    }
    next();
})

const authMiddleware = async (req, res, next) => {
    const user = await User.findById(req.session.userID);
    if (!user) {
        return res.redirect('/?message=not logged in');
    }
    next();
};

// routes
app.get('/', (req, res) => {
    res.render("index", {errors: {} });
});
app.post('/', userController.login);

app.get('/register', (req, res) => {
    res.render("create-user", { errors: {} });
});

app.post('/register', userController.create);

app.get('/logout', async (req, res) => {
    req.session.destroy();
    global.user = false;
    res.redirect('/');
});

// list of children
app.get('/children', authMiddleware, childController.list);

// add a child
app.get('/add-child', authMiddleware, (req, res) => {
    res.render("add-child", { errors: {} });
});
app.post("/add-child", authMiddleware, childController.create);

// view child profile
app.get('/child/:id', authMiddleware, childController.edit);
app.get('/child/delete/:id', authMiddleware, childController.delete);

// feeds
app.get('/feeds', (req, res) => {
    res.render("feeding");
});

// listening log
app.listen(PORT, () => {
    console.log(
        `App listening at http://localhost:${PORT}`
    );
});