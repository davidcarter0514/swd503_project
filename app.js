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
const appointmentController = require('./controllers/appointment');
const appointmentApiController = require('./controllers/api/appointment');
const feedController = require('./controllers/feed');
const feedApiController = require('./controllers/api/feed');
const changeController = require('./controllers/change');
const changeApiController = require('./controllers/api/change');
const reportController = require('./controllers/report');
const reportApiController = require('./controllers/api/report');
const incidentController = require('./controllers/incident');
const incidentApiController = require('./controllers/api/incident');

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
    // set timeout for 14 days
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

// child actvities
// appointments
app.get('/child/:id/appointments', authMiddleware, appointmentController.list);
app.get('/child/:id/appointment/:appointmentID', authMiddleware, appointmentController.read);
app.post('/child/:id/appointment/:appointmentID', authMiddleware, appointmentController.update);
// API appointment routes
app.post('/api/create-appointment', authMiddleware, appointmentApiController.create);
app.post('/api/delete-appointment', authMiddleware, appointmentApiController.delete);
app.post('/api/read-appointment', authMiddleware, appointmentApiController.read);
// feeds
app.get('/child/:id/feeds', authMiddleware, feedController.list);
// API feeds routes
app.post('/api/create-feed', authMiddleware, feedApiController.create);
app.post('/api/delete-feed', authMiddleware, feedApiController.delete);
app.post('/api/read-feed', authMiddleware, feedApiController.read);
app.post('/api/update-feed', authMiddleware, feedApiController.update);
// changes
app.get('/child/:id/changes', authMiddleware, changeController.list);
// API changes routes
app.post('/api/create-change', authMiddleware, changeApiController.create);
app.post('/api/delete-change', authMiddleware, changeApiController.delete);
app.post('/api/read-change', authMiddleware, changeApiController.read);
app.post('/api/update-change', authMiddleware, changeApiController.update);
// reports
app.get('/child/:id/reports', authMiddleware, reportController.list);
// API reports routes
app.post('/api/create-report', authMiddleware, reportApiController.create);
app.post('/api/delete-report', authMiddleware, reportApiController.delete);
app.post('/api/read-report', authMiddleware, reportApiController.read);
app.post('/api/update-report', authMiddleware, reportApiController.update);
// incidents
app.get('/child/:id/incidents', authMiddleware, incidentController.list);
// API incidents routes
app.post('/api/create-incident', authMiddleware, incidentApiController.create);
app.post('/api/delete-incident', authMiddleware, incidentApiController.delete);
app.post('/api/read-incident', authMiddleware, incidentApiController.read);
app.post('/api/update-incident', authMiddleware, incidentApiController.update);

// listening log
app.listen(PORT, () => {
    console.log(
        `App listening at http://localhost:${PORT}`
    );
});