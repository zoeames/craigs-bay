/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'craigsbay-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('auctions', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=zoe@mailinator.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });

  describe('post /auctions', function(){
    it('should make a new auction and redirect to that auction', function(done){
      request(app)
      .post('/auctions')
      .set('cookie', cookie)
      .send('itemId=540366a18b9bb702142d307d')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.header.location).to.equal('/auctions');
        done();
      });
    });
  });

  describe('get /auctions', function(){
    it('should show the auctions page', function(done){
      request(app)
      .get('/auctions')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Auctions');
        done();
      });
    });
  });
});
