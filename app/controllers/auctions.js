'use strict';

var User    = require('../models/user'),
    Auction = require('../models/auction'),
    Item    = require('../models/item');

exports.create = function(req, res){
  Auction.create(req.body, function(){
    res.redirect('/auctions');
  });
};
