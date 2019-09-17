const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

//flash message
const flash = require('connect-flash');
 
//passport login
const passport = require('passport');
const session = require('express-session');

// db related
const db = require('./models');

db.sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return db.sequelize.sync();
})
  .then(() => {
    console.log('DB Sync complete.');
})
  .catch(err => {
    console.error('Unable to connect to the database:', err); 
});

const admin = require('./routes/admin');
const accounts = require('./routes/accounts');
const auth = require('./routes/auth');
const home = require('./routes/home');
const chat = require('./routes/chat');

const app = express();
const port = 3000;

nunjucks.configure('template', {
  autoescape: true,
  express: app
});

// setting middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// uploads path setup
app.use('/uploads', express.static('uploads'));

//session DB setup
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//session 관련 셋팅
const sessionMiddleWare = session({
    secret: 'fastcampus',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 2000 * 60 * 60 //지속시간 2시간
    },
    store: new SequelizeStore({
        db: db.sequelize
    }),
});
app.use(sessionMiddleWare);

//passport apply
app.use(passport.initialize());
app.use(passport.session());

// flash message
app.use(flash());

// put it above router
app.use(function(req, res, next) {
  app.locals.isLogin = req.isAuthenticated();
  //app.locals.urlparameter = req.url; // to send current url information
  //app.locals.userData = req.user; // to send usage info
  next();
});

app.use('/', home);
app.use('/admin', admin);
app.use('/accounts', accounts);
app.use('/auth', auth);
app.use('/chat', chat);

const server = app.listen( port, function(){
  console.log('Express listening on port', port);
});

const listen = require('socket.io');
const io = listen(server);

//socket io passport 접근하기 위한 미들웨어 적용
io.use( (socket, next) => {
  sessionMiddleWare(socket.request, socket.request.res, next);
});

require('./helpers/socketConnection')(io);