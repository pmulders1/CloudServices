var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var app = require('../app')(require("../config/testDatabase.js"));;
var reqeustFunction; // = require('./testHelper')(request, app);
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
            reqeustFunction = require("./testHelper")(request, app, agent);
            done();
        }, adminuser);
    });

	after(function(done){
        this.timeout(5000);
        var user = mongoose.model('User');
        user.remove({username: "gebruiker1"}, function(err) {
            done();
        });
    });

    it('should create new user', function(done){
        this.timeout(15000);
        reqeustFunction.makePostRequest('/users', testuser, 201, function(err, res){
            if(err){ done(err); }
            expect(res.body.username).to.equal(testuser.username);
            expect(res.body.local.email).to.equal(testuser.email);
            done();
        });
    });

    it('should return races that current user is participant', function(done){
        this.timeout(15000);
        reqeustFunction.makeGetRequest('/users/me/races', 200, function(err, res){
            if(err){ done(err); }
            expect(res.body.length).to.be.at.least(1);
            done();
        });
    });
});

