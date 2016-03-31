var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var app = require('../app')(require("../config/testDatabase.js"));;
var testHelper = require('./testHelper')(request, app);

var testuser ={
    "username": "Kroegentocht",
    "local": {
    	email: "test@test.com",
    	password: "test"
    }
};

describe('Testing user route', function(){

	after(function(done){
        this.timeout(5000);
        var user = mongoose.model('User');
        user.remove({}, function(err) {
            done();
        });
    });

	it('should create one user', function(done){
		testHelper.makePostRequest('/users/', testuser, 200, function(err, res){
			if(err){ return done(err); }
			expect(res.body.username).to.equal(testuser.username);
            expect(res.body.local.email).to.equal(testuser.local.email);
			done();
		});
	});
});
