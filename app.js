
/**
 * Module dependencies.
 */

var express = require('express');
var passport = require('passport');
var lstrategy = require('passport-local'),
	LocalStrategy = lstrategy.Strategy;
var routes = require('./routes');
var user = require('./routes/user');
var deploy = require('./routes/login')
var http = require('http');
var path = require('path');
var crypto = require('crypto');

var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    BSON = require('mongodb').pure().BSON,
    assert = require('assert');


var db = new Db('manager', new Server('127.0.0.1', 27017));
var User;
/*PASSPORT STRATEGY*/
passport.use(new LocalStrategy(
  function(username, password, done) {
    // Fetch a collection to insert document into
    db.close();
    db.open(function(err,db){
        User = db.collection("users");
        User.findOne({ username: username, password: password }, function (err, user) {
            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            console.log(user);
            if (user.password != password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);

            db.close();
        });
    });
  }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    db.close();
    db.open(function(err,db){
        User.findOne({_id:id}, function(err, user) {
            done(err, user);
        });
    });
});

var app = express();

// all environments
app.set('port', process.env.PORT || 8889);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('view cache');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser("8~RFd;50,{x]@X)DqE>yC=yUKhB=5]uU`E4D/-aVh4$~fgBuxM(q@fIp6YK:(d+~')"));
app.use(express.session({secret:"8~RFd;50,{x]@X)DqE>yC=yUKhB=5]uU`E4D/-aVh4$~fgBuxM(q@fIp6YK:(d+~')"}));
app.use(passport.initialize());
app.use(passport.session());


app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login', deploy.login);
app.post('/login',
    passport.authenticate('local', { 
		successRedirect: '/',
        failureRedirect: '/login' 
		})
	);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
