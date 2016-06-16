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
            var testclient = require('../client.js')(name,headers);
            assert.equal(testclient.name, name);
            assert.equal(testclient.headers, headers);            
            done();
        });
    });
});
