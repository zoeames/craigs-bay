'use strict';

var Mongo = require('mongodb'),
    async = require('async'),
    _     = require('lodash');



function Auction(o){
  //this._id         = new Mongo.ObjectID();
  this.itemId   = o.itemId;
  this.ownerId  = o.ownerId;
  this.item     = {};
  this.user     = {};
  this.bids     = [];
}

Object.defineProperty(Auction, 'collection', {
  get: function(){return global.mongodb.collection('auctions');}
});

Auction.create = function(body, cb){
  var auction = new Auction(body);
  Auction.collection.save(auction, cb);
};

Auction.all = function(cb){
  Auction.collection.find().toArray(function(err, auctions){
    async.map(auctions, iterator, function(err, auctions){
      cb(err, auctions.map(function(o){return _.create(Auction.prototype, o);}));
    });
  });
};

function iterator(auction, cb){
  require('./user').findById(auction.ownerId, function(err, user){
    auction.user = user;
    require('./item').findById(auction.itemId, function(err, item){
      auction.item = item;
      cb(null, auction);
    });
  });
}


module.exports = Auction;
