// set up
// require all the tools we need
const express = require('express');
var app = express();
var port = process.env.port|| 4000;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var morgan = require('morgan');

var configDB = require('./config/database');

var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

//Configuration
mongoose.connect(configDB.url);

require('./config/passport')(passport);

//Setting up our express application

app.use(morgan('dev')); //logs the requests to the console
app.use(cookieParser()); //reads cookies needed for authentication
app.use(bodyParser.json()); //gets the data from html forms
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs'); // For Templating

//Required for Passport
app.use(session({
    secret: 'ilovescotchscotchscotch',  //session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());  //persistent login sessions
app.use(flash()); // use connect-flash for flashing messages stored in sessions

// Routes

require('./app/routes')(app, passport)  //Load our routes and pass in our app and fully configured passport



//Launch the server
app.listen(port);
console.log('Server runs on port '+ port);