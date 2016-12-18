
/**
 * Module dependencies.
 * @auther tashi
 */

var express = require('express')
  , routes = require('./routes/index')
  , db_repository = require('./routes/model/db_repository')
  , nippou = require('./routes/nippou')
  , http = require('http')
  , path = require('path')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , session = require('express-session');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(cookieParser());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	  secret: 'keyboard cat',
	  resave: false,
	  saveUninitialized: false,
	  cookie: {
	    maxAge: 30 * 60 * 1000
	  }
	}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', routes.index);
app.post('/input', routes.input);
app.post('/send', nippou.input);
app.post('/resist',nippou.resist);
app.post('/del',db_repository.deleteAccount);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
