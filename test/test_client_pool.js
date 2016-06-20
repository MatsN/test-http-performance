var assert = require('assert');
var client = require('../client.js');
var client_pool = require('../client_pool.js');
var util = require('util');


describe('client_pool', function () {
    describe('Constructor', function () {
        it('should return a object',function(done) {
            var test_client_pool = client_pool('test_client_pool',[client('test-client1',[{ 'testheader' : 'header_value'}], 1, 1000)]);
            assert.equal(true,test_client_pool instanceof Object);
            done();
        });
        it('object should have all attributes that was given to the constructor', function(done) {
            var client_name = 'testclient';
            var pool_name = 'test_client_pool';
            var headers = { 'testheader': 'abc'};
            var times_to_run = 10;
            var msec_between_requests = 1000;
            var testclient1 = client(client_name+"2",headers,times_to_run,msec_between_requests);
            var testclient2 = client(client_name+"1",headers,times_to_run,msec_between_requests);
            var clientsArray = [testclient1,testclient2];
            var random = false;
            var test_client_pool = client_pool('test_client_pool',clientsArray,random);
            assert.equal(pool_name,test_client_pool.name);
            assert.equal(clientsArray,test_client_pool.clients);
            assert.equal(random,test_client_pool.random);
            done();
        });
    });
    describe('getNextClient', function () {
        it('should return a client', function(done){
            var client_name = 'testclient';
            var pool_name = 'test_client_pool';
            var headers = { 'testheader': 'abc'};
            var times_to_run = 10;
            var msec_between_requests = 1000;
            var testclient1 = client(client_name,headers,times_to_run,msec_between_requests);
            var clientsArray = [testclient1];
            var random = false;
            var test_client_pool = client_pool('test_client_pool',clientsArray,random);
            var test_client = test_client_pool.getNextClient();
            assert.equal(true, test_client instanceof Object);
            assert.equal(true,test_client.name === client_name);
            done();
        });
    });
});
