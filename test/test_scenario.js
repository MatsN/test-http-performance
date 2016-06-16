var assert = require('assert');
var request_dto = require('../request_dto.js');
var scenario = require('../scenario.js');
//testserver to run scenarios agains.
var testserver = require('./mock/testserver.js');
//change this to a free port if you have something running on 8081!
var some_free_port = 8081;

var util = require('util');

testserver.start(some_free_port);

describe('scenario', function () {
    describe('Constructor', function () {
        it('should return a object',function(done) {
            var name ='test-senario';
            var description = 'test all requests';
            var requests = [
                request_dto('GET','http://example.com','/test1',{},{},false),
                request_dto('GET','http://example.com','/test2',{},{},false)
            ];
            var scenario_obj = scenario(name, description, requests);
            assert.equal(true, scenario_obj instanceof Object);
            done();
        });
        it('object should have all attributes that was given to the constructor', function(done) {
            var name ='test-senario';
            var description = 'test all requests';
            var requests = [
                request_dto('GET','http://example.com','/test1',{},{},false),
                request_dto('GET','http://example.com','/test2',{},{},false)
            ];
            var scenario_obj = scenario(name, description, requests);
            assert.equal(scenario_obj.name, name);
            assert.equal(scenario_obj.description, description);
            assert.equal(scenario_obj.requests, requests);
            done();
        });
    });
    describe('run', function () {
        it('should return a scenario_result object',function(done) {
            var name ='test-senario';
            var description = 'test all requests';
            var requests = [
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false)
            ];
            var scenario_obj = scenario(name, description, requests);
            var client = { headers : [] };
            scenario_obj.run(client, function(scenario_result) {
               assert.equal(true,scenario_result instanceof Object);
               done();
            });
        });
    });
});

//testserver.stop();