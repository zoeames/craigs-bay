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

module.exports = Auction;
