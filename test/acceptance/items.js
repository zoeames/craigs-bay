/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'craigsbay-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('items', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      request(app)
      .post('/login')
      .send('email=joann@mailinator.com')
      .send('password=1234')
      .end(function(err, res){
        cookie = res.headers['set-cookie'][0];
        done();
      });
    });
  });
  describe('get /items/new', function(){
    it('should show the new item page', function(done){
      request(app)
      .get('/items/new')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Name');
        expect(res.text).to.include('Description');
        expect(res.text).to.include('Condition');
        done();
      });
    });
  });

  describe('post /items', function(){
    it('should create a new item and redirect', function(done){
      request(app)
      .post('/items')
      .set('cookie', cookie)
      .send('name=car&description=goes+gast&photo=http%3A%2F%2Fwww.picshunger.com%2Fwp-content%2Fuploads%2F2014%2F05%2FPuppy.jpg&condition=Excellent&category=Clothing')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  //Last Braces//
});

