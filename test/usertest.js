var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var app = require('../app')(require("../config/testDatabase.js"));;
var reqeustFunction; // = require('./testHelper')(request, app);
var login = require('./loginHelper');

var testuser ={
    "username": "gebruiker1",
    "local": {
    	email: "test@test.com",
    	password: "test"
    }
};

var loginuser = {
    email: "admin@admin.com",
    password: "admin"
}

function addloginGebruiker(done){
    request(app)
        .post('/login')
        .type('json')
        .send(loginuser)
        .end(function(err, res){
            if(err){ return done(err); }
            loginuser = res.body;
            done();
        });
}

describe('Testing user route', function(){

    var agent;

    before(function(done){
        this.timeout(5000);
        login.login(request,app, function (loginAgent) {
            agent = loginAgent;
            //console.log(loginAgent);
            reqeustFunction = require("./testHelper")(request, app, agent);
            done();
        });
    });

	after(function(done){
        this.timeout(5000);
        var user = mongoose.model('User');
        //user.remove({}, function(err) {
            done();
        //});
    });

	/*it('should create one user', function(done){
		reqeustFunction.makePostRequest('/users/', testuser, 200, function(err, res){
			if(err){ return done(err); }
			expect(res.body.username).to.equal(testuser.username);
            expect(res.body.local.email).to.equal(testuser.local.email);
			done();
		});
	});*/
    it('should return races that current user is participant', function(done){
        reqeustFunction.makeGetRequest('/users/me/races', 200, function(err, res){
            if(err){ return done(err); }
            console.log(res.body)
            expect(res.body.ok).to.equal(1);
            done();
        });
    });
});

