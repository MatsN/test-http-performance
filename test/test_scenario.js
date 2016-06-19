var assert = require('assert');
var request_dto = require('../request_dto.js');
var scenario = require('../scenario.js');
var client = require('../client.js');
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
        it('scenario_result object should contain name, description, success = true, responses', function(done) {
            var name = 'test-senario';
            var description = 'test all requests';
            var requests = [
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false)
            ];
            var scenario_obj = scenario(name, description, requests);
            var client1 = client('test-client1',{ 'testheader' : 'header_value'}, 1, 1000);
            scenario_obj.run(client1, function(scenario_results) {
                for(var index = 0; index < scenario_results.length; index++) {
                   assert.equal(true, scenario_results[index].name === name);
                   assert.equal(scenario_results[index].description , description);
                   assert.equal(scenario_results[index].success , true);
                   assert.equal(true, scenario_results[index].responses instanceof Array);
                }
                done();
            });
        });
        it('should return a list of scenario_result object', function(done) {
            var name = 'test-senario';
            var description = 'test all requests';
            var requests = [
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false)
            ];
            var scenario_obj = scenario(name, description, requests);
            var client1 = client('test-client1',{ 'testheader' : 'header_value'},1, 1000);
            scenario_obj.run(client1, function(scenario_results) {
               assert.equal(true , scenario_results instanceof Array);
               done();
            });
        });

    });
    describe('apply_client_headers', function () {
        it('should return a request object modified by the client header settings',function(done) {
            var name = 'test-senario';
            var description = 'test all requests';
            var requests = [
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
            ];
            var scenario_obj = scenario(name, description, requests);
            var client1 = client('test-client1',{ 'testheader' : 'blaj'}, 1, 1000);
            var modded_request = scenario_obj.apply_client_specifics(requests[0],client1);
            assert.equal(modded_request.headers['testheader'], client1.headers['testheader']);
            done();
        });
    });
});

//testserver.stop();