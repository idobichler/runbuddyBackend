const bodyParser = require("body-parser");
const path = require('path');
const express = require('express');
const session = require('express-session');
const authRouter = require('./auth/authRoutes');
const radiusRouter = require('./location/radiusRoutes');
const restricted = require('./auth/restricted-middleware');



const PORT = 5000;
const app = express();

const sessionConfig = {
    name: 'user',
    secret: "this is a secret",
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        httpOnly: true
    },
    resave: false,
}

app.use(session(sessionConfig));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))


app.use(express.static(path.join(__dirname, '/static')));
app.use('/auth', authRouter);
app.use('/loc', restricted, radiusRouter);

app.listen(PORT);
