'use strict';

var Item = require('../models/item');

exports.new = function(req, res){
  res.render('items/new');
};

exports.create = function(req, res){
  Item.create(req.body, res.locals.user._id, function(){
    res.redirect('/users/'+res.locals.user._id+'/items');
  });
};

exports.show = function(req, res){
  Item.findById(req.params.id, function(err, item){
    res.render('items/show', {item:item});
  });
};
