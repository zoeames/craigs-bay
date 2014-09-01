'use strict';

var User = require('../models/user'),
    Item = require('../models/item');

exports.new = function(req, res){
  res.render('users/new');
};

exports.login = function(req, res){
  res.render('users/login');
};

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};

exports.create = function(req, res){
  User.register(req.body, function(err, user){
    if(user){
      res.redirect('/');
    }else{
      res.redirect('/register');
    }
  });
};

exports.authenticate = function(req, res){
  User.authenticate(req.body, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id;
        req.session.save(function(){
          res.redirect('/');
        });
      });
    }else{
      res.redirect('/login');
    }
  });
};

exports.show = function(req, res){
  User.findById(req.params.id, function(err, client){
    //console.log(client);
    res.render('users/show', {client:client});
  });
};

exports.edit = function(req, res){
  User.findById(req.params.id, function(err, client){
    if(res.locals.user._id.toString() === client._id.toString()){
      res.render('users/edit', {client:client});
    }else{
      res.redirect('/users/'+client._id);
    }
  });
};

exports.update = function(req, res){
  res.locals.user.save(req.body, function(){
    res.redirect('/users/'+res.locals.user._id);
  });
};

exports.items = function(req, res){
  //add User.findbyID and pass that to view as well
  Item.findAllByOwnerId(req.params.id, function(err, items){
    console.log(items);
    res.render('users/itemList', {items:items});
  });
};

exports.index = function(req, res){
  User.all(function(err, users){
    console.log('>>>>>>>>> CONTROLLER - index - users: ', users);
    res.render('users/index', {users:users});
  });
};


