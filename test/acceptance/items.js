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

/*
  describe('get /goals', function(){
    it('should show the goals page', function(done){
      request(app)
      .get('/goals')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('doctor');
        expect(res.text).to.include('marathon');
        done();
      });
    });
  });

  describe('get /goals/3', function(){
    it('should show a specific goal page', function(done){
      request(app)
      .get('/goals/a00000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('marathon');
        done();
      });
    });

    it('should redirect from goal show page - access error', function(done){
      request(app)
      .get('/goals/a00000000000000000000003')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('post /goals/3/tasks', function(){
    it('should create a task for a specific goal', function(done){
      request(app)
      .post('/goals/a00000000000000000000001/tasks')
      .set('cookie', cookie)
      .send('name=Get+Shoes&description=Buy+some+shoes&difficulty=Hard&rank=3')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

*/
});

