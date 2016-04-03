var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var app = require('../app')(require("../config/testDatabase.js"));
var requestFunction;
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

var testuser2 = {
	"username": "Paul",
    "email": "paul@paul.com",
    "password": "paul"
}

var testlocation = {
	"_id": "",
	"address": "Eerste Korenstraatje 16, 's-Hertogenbosch",
    "name": "Borrelcafé De Buurvrouw",
    "place_id": "ChIJ5fWUnfXuxkcR0u8l3a27Wio"
};

describe('Testing race route', function(){

	before(function(done){
		this.timeout(15000);
        done();
    });

	after(function(done){
        this.timeout(5000);
        var race = mongoose.model('Race');
        var user = mongoose.model('User');
        user.remove({username: "Paul"}, function(err) {
            done();
        });
    });

	it('should create one race', function(done){
		this.timeout(15000);
		login.login(request, app, function (loginAgent) {
            agent = loginAgent;
            requestFunction = require("./testHelper")(request, app, agent);

            requestFunction.makePostRequest('/races/', testrace, 200, function(err, res){
				if(err){ return done(err); }
				expect(res.body.name).to.equal(testrace.name);
	            expect(res.body.hasStarted).to.equal(testrace.hasStarted);
				done();
			});
        }, adminuser);
	});

	it('should return list off races', function(done){
		this.timeout(15000);
		requestFunction.makeGetRequest('/races/', 201, function(err, res){
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
		requestFunction.makePutRequest('/races/' + testrace._id, testrace, 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.name).to.equal(testrace.name);
			expect(res.body.hasStarted).to.equal(testrace.hasStarted);
			testrace = res.body
			done();
		});
	});

	it('should create new user', function(done){
        this.timeout(15000);
        requestFunction.makePostRequest('/users', testuser2, 201, function(err, res){
            if(err){ done(err); }
            expect(res.body.username).to.equal(testuser2.username);
            expect(res.body.local.email).to.equal(testuser2.email);
            testuser2 = res.body;
            done();
        });
    });

	it('should join a user to a race', function(done){
		this.timeout(15000);
		var data = {
			'_id': testrace._id,
			'userId': testuser2._id
		};
		requestFunction.makePutRequest('/races/' + testrace._id + '/participant/', data, 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.ok).to.equal(1);
			done();
		});
	});

	it('should delete a user from a race', function(done){
		this.timeout(15000);
		var data = {
			'_id': testrace._id,
			'itemId': testuser2._id
		};
		requestFunction.makeDeleteRequest('/races/' + testrace._id + '/participant/', data, 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.ok).to.equal(1);
			done();
		});
	});

	it('should add a location to a race', function(done){
		this.timeout(15000);
		var data = {
			'_id': testrace._id,
	        'place_id': testlocation.place_id,
	        'place_name': testlocation.name,
	        'place_address': testlocation.address
		};
		requestFunction.makePutRequest('/races/' + testrace._id + '/location/', data, 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.locations.length).to.be.at.least(1);
			testlocation._id = res.body.locations[0]._id;
			done();
		});
	});

	it('should start a race', function(done){
		this.timeout(15000);
		testrace.hasStarted = true
		requestFunction.makePutRequest('/races/' + testrace._id, testrace, 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.name).to.equal(testrace.name);
			expect(res.body.hasStarted).to.equal(true);
			testrace = res.body
			done();
		});
	});

	it('should tag an User to a Race', function(done){
		this.timeout(15000);
		var data = {
			'_id': testlocation._id,
	        'race_id': testrace._id,
	        'user_id': testuser2._id
		};
		requestFunction.makePutRequest('/locations/' + data._id, data, 201, function(err, res){
			if(err){ return done(err); }
			
			expect(res.body.ok).to.equal(1);
			done();
		});
	});

	it('should delete a location from a race', function(done){
		this.timeout(15000);
		var data = {
			'_id': testrace._id,
	        'itemId': testlocation.place_id,
		};
		requestFunction.makeDeleteRequest('/races/' + testrace._id + '/location/', data, 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.ok).to.equal(1);
			done();
		});
	});

	it('should delete a races', function(done){
		this.timeout(15000);
		requestFunction.makeDeleteRequest('/races/' + testrace._id, testrace, 201, function(err, res){
			if(err){ return done(err); }
			expect(res.body.ok).to.equal(1);
			done();
		});
	});
});
