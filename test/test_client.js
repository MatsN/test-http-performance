var assert = require('assert');
var client = require('../client.js');

describe('client', function () {
    describe('Constructor', function () {
        it('should return a object',function(done) {
            var testclient = require('../client.js')('testclient',{});
            assert.equal(true,testclient instanceof Object);
            done();
        });
        it('object should have all attributes that was given to the constructor', function(done) {
            var name = 'testclient';
            var headers = { 'testheader': 'abc'};
            var times_to_run = 10;
            var msec_between_requests = 1000;
            var testclient = require('../client.js')(name,headers,times_to_run,msec_between_requests);
            assert.equal(testclient.name, name);
            assert.equal(testclient.headers, headers);
            assert.equal(testclient.times_to_run, times_to_run);
            assert.equal(testclient.msec_between_requests,msec_between_requests);
            done();
        });
    });
});
