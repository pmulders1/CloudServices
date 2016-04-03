var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var app = require('../app')(require("../config/testDatabase.js"));
var reqeustFunction;
var login = require('./loginHelper');
require('../models/fillTestData')(mongoose);

var testrace ={
    "name": "Tocht",
    "hasStarted": false
};

var adminuser = {
    email: "admin@admin.com",
    password: "admin"
}

describe('Testing race route', function(){

	before(function(done){
		this.timeout(15000);
        done();
    });

	after(function(done){
        this.timeout(5000);
        var race = mongoose.model('Race');
        //race.remove({name: "Nieuwetocht"}, function(err) {
            done();
        //});
    });

	it('should create one race', function(done){
		this.timeout(15000);
		login.login(request, app, function (loginAgent) {
            agent = loginAgent;
            reqeustFunction = require("./testHelper")(request, app, agent);

            reqeustFunction.makePostRequest('/races/', testrace, 200, function(err, res){
				if(err){ return done(err); }
				expect(res.body.name).to.equal(testrace.name);
	            expect(res.body.hasStarted).to.equal(testrace.hasStarted);
				done();
			});
        }, adminuser);
	});

	it('should return list off race', function(done){
		this.timeout(15000);
		reqeustFunction.makeGetRequest('/races/', 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.data[1].name).to.equal(testrace.name);
            expect(res.body.data[1].hasStarted).to.equal(testrace.hasStarted);
            testrace = res.body.data[1];
			done();
		});
	});

	it('should update a race name', function(done){
		this.timeout(15000);
		testrace.name = "Nieuwetocht"
		reqeustFunction.makePutRequest('/races/' + testrace._id, testrace, 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.name).to.equal(testrace.name);
			expect(res.body.hasStarted).to.equal(testrace.hasStarted);
			testrace = res.body
			done();
		});
	});

	it('should join a race', function(done){
		this.timeout(15000);
		reqeustFunction.makePutRequest('/races/' + testrace._id + '/participant/', testrace, 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.name).to.equal(testrace.name);
			expect(res.body.hasStarted).to.equal(testrace.hasStarted);
			done();
		});
	});

	it('should delete a races', function(done){
		this.timeout(15000);
		reqeustFunction.makeDeleteRequest('/races/' + testrace._id, testrace, 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.ok).to.equal(1);
			done();
		});
	});
});
