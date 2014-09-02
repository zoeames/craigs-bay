'use strict';

var morgan         = require('morgan'),
    bodyParser     = require('body-parser'),
    methodOverride = require('express-method-override'),
    less           = require('less-middleware'),
    session        = require('express-session'),
    RedisStore     = require('connect-redis')(session),
    security       = require('../lib/security'),
    debug          = require('../lib/debug'),
    home           = require('../controllers/home'),
    items          = require('../controllers/items'),
    auctions        = require('../controllers/auctions'),
    users          = require('../controllers/users');

module.exports = function(app, express){
  app.use(morgan('dev'));
  app.use(less(__dirname + '/../static'));
  app.use(express.static(__dirname + '/../static'));
  app.use(bodyParser.urlencoded({extended:true}));
  app.use(methodOverride());
  app.use(session({store:new RedisStore(), secret:'my super secret key', resave:true, saveUninitialized:true, cookie:{maxAge:null}}));

  app.use(security.authenticate);
  app.use(debug.info);

  app.get('/', home.index);
  app.get('/register', users.new);
  app.post('/register', users.create);
  app.get('/login', users.login);
  app.post('/login', users.authenticate);

  app.use(security.bounce);
  app.delete('/logout', users.logout);
  app.get('/users/:id', users.show);
  app.get('/users/:id/edit', users.edit);
  app.put('/users/:id', users.update);
  app.get('/users/:id/items', users.items);
  app.get('/users', users.index);
  app.get('/users/:id/messages', users.messages);
  app.post('/messages/:userId', users.send);

  app.get('/items/new', items.new);
  app.post('/items', items.create);
  app.get('/items/:id', items.show);

  app.post('/auctions', auctions.create);
  app.get('/auctions', auctions.index);
  app.get('/auctions/:id', auctions.show);
  app.put('/auctions/:id', auctions.bid);
  app.post('/auction/:id/complete', auctions.swap);


  console.log('Express: Routes Loaded');
};

