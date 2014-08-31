/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'craigs-bay-test';

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

  describe('get /', function(){
    it('should fetch the home page', function(done){
      request(app)
      .get('/')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Home');
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
      .send('name=be+a+doctor&due=2014-11-30&tags=a%2Cb%2Cc%2Cd')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });
});

