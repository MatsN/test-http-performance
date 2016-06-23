var assert = require('assert');
var performance_test = require('../lib/performance_test.js');
var client = require('../lib/client.js');
var client_pool = require('../lib/client_pool.js');
var request_dto = require('../lib/request_dto.js');
var scenario = require('../lib/scenario.js');
//testserver to run scenarios agains.
var testserver = require('./mock/testserver.js');
//change this to a free port if you have something running on 8081!
var some_free_port = 8082;

//testdata
var describe_perf = 'Performancetesting testserver';
var client_pool_obj = client_pool('test_pool',[client('test_client1',[{ 'testheader': 'abc'}],500,10)], false);
var name = 'test-senario';
var describe_scenario = 'test all requests';
var requests = [
    request_dto('GET','http://localhost:'+some_free_port,'/', {},{},{},false),
    request_dto('GET','http://localhost:'+some_free_port,'/', {},{},{},false)
];
var scenario_obj = scenario(requests, name, describe_scenario);
var scenarios = [scenario_obj];

var requirements = { 
    max_mean_time_msec : 200,
    max_median_time_msec : 260,
    max_time_msec : 300
};


var util = require('util');

testserver.start(some_free_port);

//create a performance_test to use below
var perf_test = performance_test(scenarios, client_pool_obj, describe_perf);
var performance_test_result = undefined;

//Run the test so whe can then do tests on the result

describe('performance_test', function () {
        describe('Constructor', function () {
            it('should return a object', function(done) {
                assert.equal(true,perf_test instanceof Object);
                done();
            });
            it('object should have all attributes that was given to the constructor', function(done) {
                assert.equal(perf_test.describe,describe_perf);
                assert.equal(perf_test.client_pool,client_pool_obj);
                assert.equal(perf_test.scenarios,scenarios);
                done();
            });
            it('testing minimal setup with default constructor', function(done) {
                var scenario_test = scenario([request_dto('GET','http://localhost:'+some_free_port)]);
                var performance_t = performance_test([scenario_test]);
                performance_t.run(
                    { 
                        max_mean_time_msec : 200,
                        max_median_time_msec : 260,
                        max_time_msec : 300
                    },
                    function(test_result) {
                        assert.equal(true,test_result.success);
                        done();
                    }
                );
            });
        });
        describe('run actual performance test', function() {
            it('run and wait for result',function(done){
                perf_test.run(requirements,
                    function(test_result) {
                    performance_test_result = test_result;
                    done();
                });
            });
            it('shuld return a performance_test_result', function(done){
                assert.equal(true, performance_test_result instanceof Object);
                assert.equal(true, performance_test_result.describe === describe_perf);
                done();
            });
            it('the times of the scenario should pass the requirements', function(done) {
                performance_test_result.scenarios.forEach( function(scenario) {
                    try {
                        scenario.results.forEach( function(result) {
                            assert.equal(true, result.mean_time_ok,'The allowed mean time of '+requirements.max_mean_time_msec+'msec was exeeded('+result.mean_time+'msec)');
                            assert.equal(true, result.median_time_ok,'The allowed median time of '+requirements.max_median_time_msec+'msec was exeeded('+result.median_time+'msec)');
                            assert.equal(true, result.max_time_ok,'The allowed total maximum time of '+requirements.max_time_msec+'msec was exeeded('+result.max_time+'msec)');
                        });
                        done();
                    }
                    catch(error) {
                        done(error);
                    }
                });
            });
        });
});
//testserver.stop();