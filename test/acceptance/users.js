/* global describe, before, beforeEach, it */

'use strict';

process.env.DB   = 'craigsbay-test';

var expect  = require('chai').expect,
    cp      = require('child_process'),
    app     = require('../../app/index'),
    cookie  = null,
    request = require('supertest');

describe('users', function(){
  before(function(done){
    request(app).get('/').end(done);
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [process.env.DB], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      console.log(stdout, stderr);
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

  describe('get /register', function(){
    it('should show the register page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });
  describe('get /users/:id', function(){
    it('should show the user profile', function(done){
      request(app)
      .get('/users/000000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Profile');
        done();
      });
    });
    it('should show another user profile', function(done){
      request(app)
      .get('/users/000000000000000000000002')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Mikey Smith');
        done();
      });
    });
  });
  describe('get /users/:id/edit', function(){
    it('should show the user profile edit page', function(done){
      request(app)
      .get('/users/000000000000000000000001/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Edit Profile');
        done();
      });
    });
    it('should redirect when trying to edit another user', function(done){
      request(app)
      .get('/users/000000000000000000000002/edit')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/000000000000000000000002');
        done();
      });
    });
  });
  describe('put /users/:id', function(){
    it('should redirect to users profile', function(done){
      request(app)
      .put('/users/000000000000000000000001')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.headers.location).to.equal('/users/000000000000000000000001');
        done();
      });
    });
  });
  describe('get /users/:id/items', function(){
    it('should show all of a users items', function(done){
      request(app)
      .get('/users/000000000000000000000001/items')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Items');
        done();
      });
    });
  });
  describe('get /users', function(){
    it('should show all users', function(done){
      request(app)
      .get('/users')
      .set('cookie', cookie)
      .end(function(err, res){
        expect(res.status).to.equal(200);
        done();
      });
    });
  });
});

