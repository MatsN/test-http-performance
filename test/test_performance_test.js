var assert = require('assert');
var performance_test = require('../performance_test.js');
var client = require('../client.js');
var client_pool = require('../client_pool.js');
var request_dto = require('../request_dto.js');
var scenario = require('../scenario.js');
//testserver to run scenarios agains.
var testserver = require('./mock/testserver.js');
//change this to a free port if you have something running on 8081!
var some_free_port = 8082;

var util = require('util');



testserver.start(some_free_port);

describe('performance_test', function () {
    describe('Constructor', function () {
        it('should return a object', function(done) {
            var perf_test = performance_test();
            assert.equal(true,perf_test instanceof Object);
            done();
        });
        it('object should have all attributes that was given to the constructor', function(done) {
            var describe = 'Performancetesting testserver';
            var client_pool = {};
            var scenarios = [];
            var perf_test = performance_test(describe, client_pool, scenarios);
            assert.equal(perf_test.describe,describe);
            assert.equal(perf_test.client_pool,client_pool);
            assert.equal(perf_test.scenarios,scenarios);
            done();
        });
    });
    describe('run actual performance test', function() {
        it('the times of the scenario should not be larger than the reqired times', function(done) {
            var describe = 'Performancetesting testserver';
            var client_pool_obj = client_pool('test_pool',[client('test_client1',[{ 'testheader': 'abc'}],1,1000)],false);
            var name = 'test-senario';
            var description = 'test all requests';
            var requests = [
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false),
                request_dto('GET','http://localhost:'+some_free_port,'/',{},{},false)
            ];
            var scenario_obj = scenario(name, description, requests);
            var scenarios = [scenario_obj];
            var perf_test = performance_test(describe, client_pool_obj, scenarios);
            
            perf_test.run({ max_total_time_msec : 100,
                            max_mean_time_msec : 50,
                            max_median_time_msec : 50,
                            max_time_msec : 80 }, function(performance_test_result) {
                performance_test_result.scenarios.forEach( function(scenario) {
                    scenario.results.forEach( function(result) {
                        assert.equal(true, result.total_time_ok);
                        assert.equal(true, result.mean_time_ok);
                        assert.equal(true, result.median_time_ok);
                        assert.equal(true, result.max_time_ok);
                    });
                });
                done();
            });
        });
    });
});
//testserver.stop();