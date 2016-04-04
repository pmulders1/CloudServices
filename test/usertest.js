var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var app = require('../app')(require("../config/testDatabase.js"));;
var requestFunction; // = require('./testHelper')(request, app);
var login = require('./loginHelper');

var testuser = {
    "username": "gebruiker1",
    "email": "test@test.com",
    "password": "test"
};

var adminuser = {
    email: "admin@admin.com",
    password: "admin"
}

describe('Testing user route', function(){

    var agent;

    before(function(done){
        this.timeout(15000);
        login.login(request, app, function (loginAgent) {
            agent = loginAgent;
            requestFunction = require("./testHelper")(request, app, agent);
            done();
        }, adminuser);
    });

	after(function(done){
        this.timeout(5000);
        var user = mongoose.model('User');
        //user.remove({username: "StijnSmulders"}, function(err) {
            done();
        //r});
    });

    it('should create new user', function(done){
        this.timeout(15000);
        requestFunction.makePostRequest('/users', testuser, 201, function(err, res){
            if(err){ done(err); }
            expect(res.body.username).to.equal(testuser.username);
            expect(res.body.local.email).to.equal(testuser.email);
            done();
        });
    });

    it('should return list off users', function(done){
        this.timeout(15000);
        requestFunction.makeGetRequest('/users/', 201, function(err, res){
            if(err){ return done(err); }
            expect(res.body.data[0].name).to.equal(adminuser.name);
            expect(res.body.data[0].hasStarted).to.equal(adminuser.hasStarted);
            expect(res.body.data[1].name).to.equal(testuser.name);
            expect(res.body.data[1].hasStarted).to.equal(testuser.hasStarted);
            testuser = res.body.data[1];
            done();
        });
    });

    it('should update a user name', function(done){
        this.timeout(15000);

        testuser.username = "StijnSmulders";
        testuser.email = "stino@avans.nl"

        requestFunction.makePutRequest('/users/' + testuser._id, testuser, 201, function(err, res){
            if(err){ return done(err); }
            expect(res.body.ok).to.equal(1);
            done();
        });
    });

    it('should return races that current user is participant', function(done){
        this.timeout(15000);
        requestFunction.makeGetRequest('/users/me/races', 200, function(err, res){
            if(err){ done(err); }
            expect(res.body.length).to.be.at.least(1);
            done();
        });
    });
    it('should return list paginated list off users', function(done){
        this.timeout(15000);
        requestFunction.makeGetRequest('/users/?pagenr=2&itemsPerPage=1', 201, function(err, res){
            if(err){ return done(err); }
            expect(res.body.data[0].name).to.equal(testuser.name);
            expect(res.body.data[0].hasStarted).to.equal(testuser.hasStarted);
            done();
        });
    });
    it('should delete a user', function(done){
        this.timeout(15000);
        requestFunction.makeDeleteRequest('/users/' + testuser._id, testuser, 201, function(err, res){
            if(err){ return done(err); }
            expect(res.body.ok).to.equal(1);
            done();
        });
    });
});

