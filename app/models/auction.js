'use strict';

var Mongo = require('mongodb'),
    _     = require('lodash');



function Auction(itemId){
  //this._id         = new Mongo.ObjectID();
  this.itemId    = itemId;
  this.bids    = [];
}

Object.defineProperty(Auction, 'collection', {
  get: function(){return global.mongodb.collection('auctions');}
});

Auction.create = function(itemId, cb){
  var auction = new Auction(itemId);
  Auction.collection.save(auction, cb);
};

module.exports = Auction;
