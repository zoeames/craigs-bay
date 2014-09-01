'use strict';

var Mongo = require('mongodb'),
    _     = require('lodash');



function Auction(o){
  //this._id         = new Mongo.ObjectID();
  this.itemId   = o.itemId;
  this.ownerId  = o.ownerId;
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
    cb(err, auctions.map(function(o){return _.create(Auction.prototype, o);}));
  });
};
module.exports = Auction;
