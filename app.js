var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
//var sassMiddleware = require('node-sass-middleware');
var fs = require('fs');
var session = require('express-session')
var mongoose = require('mongoose');
var flash = require('express-flash');
var env = require('dotenv').config()
const MongoStore = require('connect-mongo')(session);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// derp TODO may use node sass instead of grunt
//  "node-sass-middleware": "^0.11.0", -> npm install
/*app.use(sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
}));*/


// database connection
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log("Connected to mongo. DB_URL = " + process.env.DB_URL)
});


// session
app.use(session({
    secret: 'testSecret',
    cookie: { maxAge: 3600000, secure: false },
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));


// flash messages
app.use(flash());


// file routes
app.use('/css',express.static(path.join(__dirname, 'public/stylesheets')));
app.use('/js',express.static(path.join(__dirname, 'public/javascripts')));
app.use('/img',express.static(path.join(__dirname, 'public/images')));
app.use('/json',express.static(path.join(__dirname, 'public/data')));


// dynamically include routes
fs.readdirSync('./routes').forEach(function (file) {
    if(file.substr(-3) == '.js') {
        route = require('./routes/' + file);
        route.controller(app);
    }
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});



module.exports = app;
