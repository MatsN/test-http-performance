var assert = require('assert');

describe('request_dto', function () {
    describe('Constructor', function () {
        it('should return a object',function(done) {
            var request_dto_obj = require('../request_dto.js')('GET','http://example.com','/test',{},[],false);
            assert.equal(true,request_dto_obj instanceof Object);
            done();
        });
        it('object should have all attributes that was given to the constructor', function(done) {
            var method = 'GET';
            var domain = 'http://example.com';
            var path = '/test';
            var body = {};
            var headers = {};
            var json = false;
            var request_dto_obj = require('../request_dto.js')(method,domain,path,body,headers,json);
            assert.equal(true,request_dto_obj.method !== undefined);
            assert.equal(request_dto_obj.method, method);
            assert.equal(true,request_dto_obj.domain  !== undefined);
            assert.equal(request_dto_obj.domain, domain);            assert.equal(true,request_dto_obj.path   !== undefined);
            assert.equal(request_dto_obj.path, path);
            assert.equal(true,request_dto_obj.body  !== undefined);
            assert.equal(request_dto_obj.body, body);
            assert.equal(true,request_dto_obj.headers !== undefined);
            assert.equal(request_dto_obj.headers, headers);
            assert.equal(true,request_dto_obj.json !== undefined);
            assert.equal(request_dto_obj.json, json);
            done();
        });
    });
});
