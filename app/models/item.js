'use strict';

var Mongo = require('mongodb'),
    _     = require('lodash');

function Item(obj, userId){
  //this._id         = new Mongo.ObjectID();
  this.name        = obj.name;
  this.ownerId     = userId;
  this.photo       = obj.photo;
  this.description = obj.description;
  this.condition   = obj.condition;
  this.category    = obj.category;
  this.status      = 'free';
}

Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('items');}
});

Item.findAllByOwnerId = function(ownerId, cb){
  ownerId = Mongo.ObjectID(ownerId);
  Item.collection.find({ownerId:ownerId}).toArray(cb);
};

Item.create = function(obj, ownerId, cb){
  if (obj.iStatus == 'isAuction'){
    var newItem = new Item(obj, ownerId);
    Item.collection.save(newItem, function(err, item){
      item.itemId = item._id;
      require('./auction').create(item, cb);
    });
  }else{
  var item = new Item(obj, ownerId);
  Item.collection.save(item, cb);
  }
};

Item.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Item.collection.findOne({_id:_id}, function(err, obj){
    cb(err, _.create(Item.prototype, obj));
  });
};


module.exports = Item;
