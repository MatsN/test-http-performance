
var Q = require('q');
var request = require('request');
var util = require('util');

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
        var responses_done = 0;
        var scenario_result = {
            name : self.name,
            description : self.description,
            success : true,
            responses   : []
        };
        for(var index = 0; index < self.requests.length; index++) {
            var time_before_req = new Date();
            do_request(self.requests[index]).then( function(result) {
                scenario_result.responses.push({ url : self.requests[index], success: true, request_time : get_elapsed_time(time_before_req) });
                responses_done++;
                if(responses_done===self.requests.length){
                    cb(scenario_result);
                }
            }).fail( function(result) {
                scenario_result.responses.push({ url : self.requests[index], success: false, request_time : get_elapsed_time(time_before_req) });
                scenario_result.success = false;
                responses_done++;
                if(responses_done===self.requests.length){
                    cb(scenario_result);
                }
            }).catch(function (error) {
                console.log(util.inspect(error));
            }).done();
        }
    }
}

function apply_client_specifics(request_dto, client) {
    for(var h_index =0; h_index < client.headers.length; h.index++) {
        //if(client.headers[h_index]
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
                    response: response
                });
            } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                deferred.resolve({
                    response: response,
                    body: body
                });
            } else {
                deferred.reject({
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
