const express = require('express');
const nunjucks = require('nunjucks');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

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

app.get('/', function(req, res) {
  res.send('first app kaden cho after nodemon');
});

app.use('/admin', admin);

app.listen(port, function() {
  console.log('Express listening on port', port);
});
