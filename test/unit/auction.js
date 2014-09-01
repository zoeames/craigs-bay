/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Auction   = require('../../app/models/auction'),
    dbConnect = require('../../app/lib/mongodb'),
    Mongo     = require('mongodb'),
    cp        = require('child_process'),
    db        = 'craigsbay-test';

describe('Auction', function(){
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
  describe('constructor', function(){
    it('should construct an auction', function(){
      var itemId = new Mongo.ObjectID(),
          auction = new Auction(itemId);
      expect(auction).to.be.instanceof(Auction);
    });
  });
  describe('.create', function(){
    it('should construct and save an auction', function(done){
      var itemId = new Mongo.ObjectID();
      Auction.create(itemId, function(err, auction){
        expect(auction).to.be.ok;
        done();
      });
    });
  });
});
