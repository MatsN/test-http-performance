
var Q = require('q');
var request = require('request');
var util = require('util');
var RateLimiter = require('limiter').RateLimiter;
/**
* Constructor for scenario
* @private
* @method scenario
* @param {Object} name
* @param {Object} description
* @param {Object} requests
* @return {Object} description
*/
var scenario = function(name, description, requests) {
    var self = this;
    self.name = name;
    self.description = description;
    self.requests = requests;
    

    var util = require('util');
    /**
    * Run the scenario
    * @private
    * @method run
    * @param {Object} client to use for the scenario
    * @param {Object} cb
    * @return {Object} description
    */
    self.run = function(client, cb) {
        var limiter = new RateLimiter(1, client.msec_between_requests);
        var scenario_results = [];
        var attempts_done = 0;
        for(var attempts = 0; attempts < client.times_to_run; attempts++) {
        //for(var attempts = 0; attempts < 1; attempts++) {
            var responses_done = 0;
            var scenario_result = {
                name : self.name,
                description : self.description,
                success : true,
                responses   : []
            };
            for(var index = 0; index < self.requests.length; index++) {
                self.requests[index].index = index;
                self.apply_client_specifics(self.requests[index],client);
            }
            limiter.removeTokens(1, function() {
                
                do_request(self.requests.pop()).then( function(result) {
                    scenario_result.responses.push({ url : result.request.url, success: true, request_time : get_elapsed_time(result.request.start_time)});
                    self.requests.unshift(result.request);
                    responses_done++;
                    if(responses_done === self.requests.length) {
                        responses_done = 0;
                        scenario_results.push(scenario_result);
                        attempts_done++;
                    }
                    if(attempts_done === client.times_to_run) {
                        attempts_done = 0;
                        cb(scenario_results);
                    }
                }).fail( function(error) {
                    scenario_result.responses.push({ url : error.request.url, success: false, request_time : get_elapsed_time(result.request.start_time) });
                    scenario_result.success = false;
                    responses_done++;
                    if(responses_done === self.requests.length) {
                        scenario_results.push(scenario_result);
                        attempts_done++;
                    }
                    if(attempts_done === client.times_to_run) {
                        cb(scenario_results);
                        return;
                    }
                });
            });
        }
    }
    self.apply_client_specifics = function(request_dto, client) {
        for(var propertyName in client.headers) {
            if(request_dto.headers[propertyName] === undefined) {
                request_dto.headers[propertyName] = client.headers[propertyName];
            }
        }
        return request_dto;
    }
}

function get_elapsed_time(then) {
    return new Date().getTime() - then.getTime();
}

/**
* Description for do_request
* @private
* @method do_request
* @param {Object} request_dto
* @return {Object} description
*/
function do_request(request_dto) {
    console.info(util.inspect(request_dto));
    request_dto.start_time = new Date();
    var deferred = Q.defer();
    request(request_dto.get_request(), function(error, response, body) {
        if (error) {
            deferred.reject(error);
        } else {
            if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                try {
                    body = JSON.parse(body);
                } catch (e) {

                }
            }
            if (response.statusCode === 204) {
                deferred.resolve({
                    request: request_dto,
                    response: response
                });
            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                deferred.resolve({
                    request: request_dto,
                    response: response,
                    body: body
                });
            } else {
                deferred.reject({
                    request: request_dto,
                    response: response,
                    body: body
                });
            }
        }
    });
    return deferred.promise;
}

module.exports = function (name, description, requests) {
    return new scenario(name, description, requests);
}
