var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should();
var mongoose = require('mongoose');
var app = require('../app')(require("../config/testDatabase.js"));;
var requestFunction; 
var login = require('./loginHelper');

var testlocation = {
	"place_id": "ChIJsVYznYruxkcRGn-allVHDw0",
    "name": "Restaurant Mell's Place",
    "address": "Stationsplein 89, 's-Hertogenbosch"
};

var adminuser = {
    email: "admin@admin.com",
    password: "admin"
};

describe('Testing location route', function(){

    var agent;

    before(function(done){
        this.timeout(15000);
        login.login(request, app, function (loginAgent) {
            agent = loginAgent;
            requestFunction = require("./testHelper")(request, app, agent);
            done();
        }, adminuser);
    });

    it('should return list off locations', function(done){
        this.timeout(15000);
        requestFunction.makeGetRequest('/locations/', 201, function(err, res){
            if(err){ return done(err); }
            expect(res.body.data[0].place_id).to.equal(testlocation.place_id);
            expect(res.body.data[0].name).to.equal(testlocation.name);
            expect(res.body.data[0].address).to.equal(testlocation.address);
            testlocation = res.body.data[0];
            done();
        });
    });
    it('should return list paginated list off locations', function(done){
        this.timeout(15000);
        requestFunction.makeGetRequest('/locations/?pagenr=1&itemsPerPage=1', 201, function(err, res){
            if(err){ return done(err); }
            expect(res.body.pagenr).to.equal('1');
            expect(res.body.itemsPerPage).to.equal('1');
            expect(res.body.data[0].name).to.equal(testlocation.name);
            expect(res.body.data[0].address).to.equal(testlocation.address);
            expect(res.body.data[0].place_id).to.equal(testlocation.place_id);
            done();
        });
    });
});

