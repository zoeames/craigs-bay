'use strict';

var Mongo = require('mongodb'),
    async = require('async'),
    Item  = require('./item'),
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
  Item.collection.findAndModify({_id:Mongo.ObjectID(body.itemId)}, [], {$set:{status:'isAuction'}},function(err, item){
    Auction.collection.save(auction, cb);
  });
};

Auction.all = function(cb){
  Auction.collection.find().toArray(function(err, auctions){
    async.map(auctions, iterator, function(err, auctions){
      console.log(auctions);
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

Auction.findById = function(auctionId, cb){
  auctionId = Mongo.ObjectID(auctionId);
  Auction.collection.findOne({_id:auctionId}, function(err, auction){
    async.map(auction.bids, auctionIterator, function(err, bids){
      auction.bids = bids;
      require('./item').findById(auction.itemId, function(err, item){
        auction.item = item;
        cb(err, auction);
      });
    });
  });
};

function auctionIterator(bid, cb){
  require('./item').findById(Mongo.ObjectID(bid), function(err, item){
    bid = item;
    cb(null, bid);
  });
}

Auction.bid = function(auctionId, itemId, cb){
  Auction.collection.findAndModify({_id:Mongo.ObjectID(auctionId)}, [], {$push:{bids:itemId}}, function(){
    Item.collection.findAndModify({_id:Mongo.ObjectID(itemId)},[],{$set:{status:'isBid'}},cb);
  });
};

Auction.swap = function(itemId, winningBidId, auctionId,cb){
  Item.collection.findOne({_id:Mongo.ObjectID(itemId)}, function(err, wonItem){
    Item.collection.findOne({_id:Mongo.ObjectID(winningBidId)}, function(err, bidItem){
      var ownerId = wonItem.ownerId,
         winnerId = bidItem.ownerId;
      wonItem.ownerId = Mongo.ObjectID(winnerId);
      wonItem.status = 'free';
      bidItem.ownerId = Mongo.ObjectID(ownerId);
      bidItem.status = 'free';
      Item.collection.save(bidItem, function(){
        Item.collection.save(wonItem, function(){
          Auction.collection.findOne({_id:Mongo.ObjectID(auctionId)}, function(err, auction){
            async.forEach(auction.bids, function(bid){
              Item.collection.findAndModify({_id:Mongo.ObjectID(bid)},[],{$set:{status:'free'}}, cb);
            }, function(){
              Auction.collection.remove({_id:Mongo.ObjectID(auctionId)},  cb);
            });
          });
        });
      });
    });
  });
};

module.exports = Auction;
