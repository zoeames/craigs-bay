'use strict';

var Auction   = require('../models/auction'),
    //User    = require('../models/user'),
    //Mongo   = require('mongodb'),
    Item      = require('../models/item');

exports.create = function(req, res){
  Auction.create(req.body, function(){
    res.redirect('/auctions');
  });
};

exports.index = function(req, res){
  Auction.all(function(err, auctions){
    res.render('auctions/index', {auctions:auctions});
  });
};

exports.show = function(req, res){
  Auction.findById(req.params.id, function(err, auction){
    Item.collection.find({ownerId:res.locals.user._id, status:'free'}).toArray(function(err, biddable){
      res.render('auctions/show', {auction:auction, biddable:biddable});
    });
  });
};

exports.bid = function(req, res){
  Auction.bid(req.params.id, req.body.bidId, function(){
    console.log(req.body.bidId);
    res.redirect('/auctions/'+req.params.id);
  });
};

exports.swap = function(req, res){
  console.log(req.body.itemId);
  Auction.swap(req.body.itemId, req.body.winningBidId, req.params.id, function(){
    res.redirect('/auctions');
  });
};
