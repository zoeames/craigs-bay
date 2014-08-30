'use strict';

var Item = require('../models/item');

exports.new = function(req, res){
  res.render('items/new');
};

exports.create = function(req, res){
  Item.create(req.body, res.locals.user.id, function(){
    res.redirect('/items/:id');
  });
};
