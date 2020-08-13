let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let redis = require('redis');
let logger = require('morgan');
let sassMiddleware = require('node-sass-middleware');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let authRouter = require('./routes/auth');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient();

// Dangerous!!
// Since version 1.5.0, the cookie-parser middleware no longer
//  needs to be used for this module to work. This module now directly
//  reads and writes cookies on req/res. Using cookie-parser may result
//  in issues if the secret is not the same between this module and cookie-parser.
const cookieSecret = 'keyboard cat';

app.use(session({
  name: "beepit.sid",
  store: new RedisStore({ client: redisClient }),
  secret: `${cookieSecret} abc`,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: (function() {
      if (app.get('env') === 'production') {
        app.set('trust proxy', 1) // trust first proxy
        return true;
      }

      return false;
    })(),
    // session cookie expires after 15 seconds from now on
    // maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days (in milliseconds)
    maxAge: 60 * 1000, // 60 seconds
    // .beepit.loc universal login
    domain: '.beepit.loc',
  }
}));
app.use(cookieParser(cookieSecret));

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

// customized auth
app.use(function (req, res, next) {
  const user = req.session.user;

  // for view
  console.debug('session.user = %j', req.session.user);
  if (user) {
    res.locals.user = user
    res.locals.userId = user._id
  }

  console.debug('cookie beepit.h = %j', req.cookies['beepit.h']);
  res.cookie('beepit.h', `${req.host}-123abc`);

  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
