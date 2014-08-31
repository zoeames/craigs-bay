'use strict';

//var Mongo = require('mongodb'),
    //_     = require('lodash');

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
  Item.collection.find({ownerId:ownerId}).toArray(cb);
};

Item.create = function(obj, ownerId, cb){
  var item = new Item(obj, ownerId);
  Item.collection.save(item, cb);
};

module.exports = Item;
