require('dotenv').config();
const express = require('express');
const path = require('path');
const moongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

const {PORT, MONGODB_URI} = process.env;

moongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
moongoose.connection.on('error', (err) => {
    console.log(err);
    console.log(
        "MongoDB connection error. Please make sure MongoDB is running."
    );
    process.exit();
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
    res.render("index");
});

app.listen(PORT, () => {
    console.log(
        `App listening at http://localhost:${PORT}`
    );
});