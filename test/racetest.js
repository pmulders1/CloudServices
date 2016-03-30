var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var app = require('../app')(require("../config/testDatabase.js"));;
var testHelper = require('./testHelper')(request, app);

var testrace ={
    "name": "Kroegentocht",
    "hasStarted": true
};

describe('Testing race route', function(){

	after(function(done){
        this.timeout(5000);
        var race = mongoose.model('Race');
        race.remove({}, function(err) {
            done();
        });
    });

	it('should create one race', function(done){
		testHelper.makePostRequest('/races/add', testrace,200, function(err, res){
			if(err){ return done(err); }
			expect(res.body.name).to.equal(testrace.name);
            expect(res.body.hasStarted).to.equal(testrace.hasStarted);
			done();
		});
	});
	it('should return list off race', function(done){
		testHelper.makeGetRequest('/races/all', 200, function(err, res){
			if(err){ return done(err); }
			expect(res.body[0].name).to.equal(testrace.name);
            expect(res.body[0].hasStarted).to.equal(testrace.hasStarted);
            testrace = res.body[0];
			done();
		});
	});
	it('should update a races', function(done){
		testrace.name = "Nieuwetocht"
		testHelper.makePutRequest('/races/' + testrace._id, testrace,200, function(err, res){
			if(err){ return done(err); }
			expect(res.body.ok).to.equal(1);
			done();
		});
	});
});