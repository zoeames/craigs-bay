/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Item      = require('../../app/models/item'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'craigsbay-test';

describe('Item', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('.create', function(){
    it('should create a item', function(done){
      var body = {name:'swing set', category:'home'},
          userId = Mongo.ObjectID('000000000000000000000001');
      Item.create(body, userId, function(err, item){
        expect(item).to.be.instanceof(Item);
        expect(item._id).to.be.instanceof(Mongo.ObjectID);
        expect(item.ownerId).to.be.instanceof(Mongo.ObjectID);
        expect(item.name).to.equal('swing set');
        expect(item.category).to.equal('home');
        done();
      });
    });
  });

});
