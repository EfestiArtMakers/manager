
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

/*PASSPORT STRATEGY*/
passport.use(new LocalStrategy(
  function(username, password, done) {
    /*User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });*/
	if(username !== 'riccardo.masetti')
		return done(null, false, { message: 'Incorrect username or password.' });
	if(password !== 'rcrmst80')
		return done(null, false, { message: 'Incorrect username or password.' });
	return done(null,user);
  }
));
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
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
