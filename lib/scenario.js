
var Q = require('q');
var request = require('request');
var util = require('util');
var client_ = require('./client.js');
/**
* Constructor for scenario
* @private
* @method scenario
* @param {Object} name
* @param {Object} description
* @param {Object} requests
* @return {Object} description
*/
var scenario = function(requests, name, description) {
    var self = this;
    if(name === undefined) {
        self.name = 'default_scenario';
    }
    else{
        self.name = name;
    }
    if(description === undefined) {
        self.description = 'A Sceanrio';
    }
    else{
        self.description = description;
    }
    self.requests = requests;
    /**
    * Run the scenario
    * @private
    * @method run
    * @param {Object} client to use for the scenario
    * @param {Object} cb
    * @return {Object} description
    */
    self.run = function(client, cb) {
        if(arguments.length === 1){
            cb = client;
            client = client_();
        }
        var scenario_results = [];
        var attempts_done = 0;
        for(var attempts = 0; attempts < client.times_to_run; attempts++) {
            setTimeout( function() {
                self.do_attempt(client,function(scenario_result) {
                    scenario_results.push(scenario_result);
                    attempts_done++;
                    if(attempts_done === client.times_to_run){
                        cb(scenario_results);
                    }
                });
            },client.msec_between_requests*(attempts+1));
        }
    }
    self.apply_client_specifics = function(request_dto, client) {
        for(var propertyName in client.headers) {
            request_dto.headers[propertyName] = client.headers[propertyName];
        }
    }
    self.do_attempt = function(client, cb) {
        
            var responses_done = 0;
            var scenario_result = {
                name : self.name,
                description : self.description,
                success : true,
                responses   : []
            };
            var nr_of_rquests = self.requests.length;
            for(var index = 0; index < nr_of_rquests; index++) {
                var currentRequest = self.requests.pop();
                self.requests.unshift(currentRequest);
                currentRequest.index = index;
                self.apply_client_specifics(currentRequest, client);
                do_request(currentRequest).then( function(result) {
                    scenario_result.responses.push({ url : result.request.get_uri(), success: true, request_time : get_elapsed_time(result.request.start_time)});
                    responses_done++;
                    if(responses_done === self.requests.length) {
                        responses_done = 0;
                        cb(scenario_result);
                    }
                }).fail( function(error) {
                    scenario_result.responses.push({ url : error.request.get_uri(), success: false, request_time : get_elapsed_time(result.request.start_time) });
                    scenario_result.success = false;
                    responses_done++;
                    if(responses_done === self.requests.length) {
                        cb(scenario_result);
                    }
                });
            }
    }
}

/**
* Description for get_elapsed_time
* @private
* @method get_elapsed_time
* @param {Object} then
* @return {Object} description
*/
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

    var deferred = Q.defer();
    setTimeout( function() {
        request_dto.start_time = new Date();
        var req = request(request_dto.get_request(), function(error, response, body) {
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
    },request_dto.timeout);
    return deferred.promise;
}

module.exports = function (requests, name, description) {
    return new scenario(requests, name, description);
}
