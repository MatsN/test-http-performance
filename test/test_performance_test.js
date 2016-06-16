var assert = require('assert');
var performance_test = require('../performance_test.js');

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
});
