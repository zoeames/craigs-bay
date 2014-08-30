'use strict';

var Mongo = require('mongodb'),
    Item  = require('./item');

function Item(obj, userId){
  this.id       = new Mongo.ObjectID();
  this.name     = obj.name;
  this.ownerId  = userId;
  this.photo    = obj.photo;
  this.desc     = obj.desc;
  this.cond     = obj.cond;
  this.category = obj.category;
  this.status   = 'free';
}

Object.defineProperty(Item, 'collection', {
  get: function(){return global.mongodb.collection('items');}
});

Item.create = function(obj, userId, cb){
  var item = new Item(obj, userId);
  Item.collection.save(item, cb);
};


