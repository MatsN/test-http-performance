var assert = require('assert');

describe('request_dto', function () {
    describe('Constructor', function () {
        it('should return a object',function(done) {
            var request_dto_obj = require('../request_dto.js')('GET','http://example.com','/test', undefined,{},[],false);
            assert.equal(true,request_dto_obj instanceof Object);
            done();
        });
        it('object should have all attributes that was given to the constructor', function(done) {
            var method = 'GET';
            var domain = 'http://example.com';
            var path = '/test';
            var queryParameters = {};
            var body = {};
            var headers = {};
            var json = false;
            var request_dto_obj = require('../request_dto.js')(method,domain,path,queryParameters,body,headers,json);
            assert.equal(request_dto_obj.method, method);
            assert.equal(request_dto_obj.domain, domain);            
            assert.equal(request_dto_obj.path, path);
            assert.equal(request_dto_obj.queryParameters, queryParameters);
            assert.equal(request_dto_obj.body, body);
            assert.equal(request_dto_obj.headers, headers);
            assert.equal(request_dto_obj.json, json);
            done();
        });
    });
});
